<?php
/**
 * Analytics and Reporting Controller
 */

class AnalyticsController extends Controller {
    
    public function dashboard() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $inventoryModel = new InventoryItem();
            $companyModel = new Company();
            $userModel = new User();
            
            $data = [];
            
            // Get inventory stats
            $inventoryStats = $inventoryModel->getStats($this->user);
            $data['inventory'] = $inventoryStats;
            
            // Get low stock items count
            $lowStockItems = $inventoryModel->getLowStockItems($this->user);
            $data['inventory']['low_stock_count'] = count($lowStockItems);
            
            // Get top categories
            $data['top_categories'] = $inventoryModel->getTopCategories($this->user, 5);
            
            // Role-specific stats
            if ($this->user['role'] === 'superadmin') {
                $data['users'] = $userModel->getStats();
                $data['companies'] = $companyModel->getStats();
            } elseif ($this->user['role'] === 'manager') {
                $data['companies'] = $companyModel->getStats();
            } elseif ($this->user['role'] === 'partner') {
                $data['assigned_companies'] = $companyModel->getUserCompanies($this->user['id']);
            }
            
            // Recent activity (simplified)
            $data['recent_activity'] = $this->getRecentActivity();
            
            Response::success($data);
        } catch (Exception $e) {
            logError('Get dashboard data failed: ' . $e->getMessage());
            Response::error('Failed to get dashboard data', 500);
        }
    }
    
    public function inventoryStats() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $inventoryModel = new InventoryItem();
            
            $stats = $inventoryModel->getStats($this->user);
            $topCategories = $inventoryModel->getTopCategories($this->user, 10);
            $lowStockItems = $inventoryModel->getLowStockItems($this->user);
            
            $data = [
                'stats' => $stats,
                'top_categories' => $topCategories,
                'low_stock_items' => $lowStockItems,
                'categories' => $inventoryModel->getCategories($this->user)
            ];
            
            Response::success($data);
        } catch (Exception $e) {
            logError('Get inventory stats failed: ' . $e->getMessage());
            Response::error('Failed to get inventory stats', 500);
        }
    }
    
    public function companyStats() {
        if (!$this->requireManager()) {
            return;
        }
        
        try {
            $companyModel = new Company();
            
            $stats = $companyModel->getStats();
            $topCompanies = $companyModel->getTopCompaniesByValue(10);
            
            $data = [
                'stats' => $stats,
                'top_companies' => $topCompanies,
                'industries' => $companyModel->getIndustries()
            ];
            
            Response::success($data);
        } catch (Exception $e) {
            logError('Get company stats failed: ' . $e->getMessage());
            Response::error('Failed to get company stats', 500);
        }
    }
    
    public function trends() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            // Get inventory value trends over time (simplified)
            $sql = "SELECT 
                        DATE(created_at) as date,
                        COUNT(*) as items_added,
                        SUM(current_quantity * unit_price) as value_added
                    FROM inventory_items 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
            
            $params = [];
            
            if ($this->user['role'] === 'partner') {
                $sql .= " AND company_id IN (
                    SELECT company_id FROM company_partners 
                    WHERE user_id = :user_id AND status = 'active'
                )";
                $params['user_id'] = $this->user['id'];
            }
            
            $sql .= " GROUP BY DATE(created_at) ORDER BY date";
            
            $trends = $this->db->fetchAll($sql, $params);
            
            Response::success(['trends' => $trends]);
        } catch (Exception $e) {
            logError('Get trends failed: ' . $e->getMessage());
            Response::error('Failed to get trends', 500);
        }
    }
    
    public function export() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $type = $this->getQueryParam('type', 'inventory');
            $format = $this->getQueryParam('format', 'csv');
            
            switch ($type) {
                case 'inventory':
                    $this->exportInventory($format);
                    break;
                case 'companies':
                    if (!$this->requireManager()) return;
                    $this->exportCompanies($format);
                    break;
                default:
                    Response::error('Invalid export type', 400);
            }
        } catch (Exception $e) {
            logError('Export failed: ' . $e->getMessage());
            Response::error('Export failed', 500);
        }
    }
    
    private function exportInventory($format) {
        $sql = "SELECT i.name, i.sku, i.category, i.current_quantity, 
                       i.min_stock_level, i.unit_price, i.total_value,
                       c.name as company_name, i.status, i.created_at
                FROM inventory_items i
                LEFT JOIN companies c ON i.company_id = c.id
                WHERE i.status = 'active'";
        
        $params = [];
        
        if ($this->user['role'] === 'partner') {
            $sql .= " AND i.company_id IN (
                SELECT company_id FROM company_partners 
                WHERE user_id = :user_id AND status = 'active'
            )";
            $params['user_id'] = $this->user['id'];
        }
        
        $sql .= " ORDER BY i.name";
        
        $data = $this->db->fetchAll($sql, $params);
        
        if ($format === 'csv') {
            $this->exportToCsv($data, 'inventory_export_' . date('Y-m-d') . '.csv');
        } else {
            Response::success($data);
        }
    }
    
    private function exportCompanies($format) {
        $sql = "SELECT c.name, c.industry, c.email, c.phone, c.city, c.status,
                       COUNT(DISTINCT i.id) as inventory_count,
                       COALESCE(SUM(i.current_quantity * i.unit_price), 0) as total_value,
                       c.created_at
                FROM companies c
                LEFT JOIN inventory_items i ON c.id = i.company_id AND i.status = 'active'
                WHERE c.status = 'active'
                GROUP BY c.id
                ORDER BY c.name";
        
        $data = $this->db->fetchAll($sql);
        
        if ($format === 'csv') {
            $this->exportToCsv($data, 'companies_export_' . date('Y-m-d') . '.csv');
        } else {
            Response::success($data);
        }
    }
    
    private function exportToCsv($data, $filename) {
        if (empty($data)) {
            Response::error('No data to export', 400);
            return;
        }
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        
        $output = fopen('php://output', 'w');
        
        // Write headers
        fputcsv($output, array_keys($data[0]));
        
        // Write data
        foreach ($data as $row) {
            fputcsv($output, $row);
        }
        
        fclose($output);
        exit();
    }
    
    private function getRecentActivity() {
        $sql = "SELECT action, entity_type, entity_id, created_at, 
                       u.name as user_name
                FROM audit_trail a
                LEFT JOIN users u ON a.user_id = u.id
                ORDER BY a.created_at DESC
                LIMIT 10";
        
        return $this->db->fetchAll($sql);
    }
}
