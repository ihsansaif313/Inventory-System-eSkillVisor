<?php
/**
 * Inventory Management Controller
 */

class InventoryController extends Controller {
    
    public function index() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $pagination = $this->getPaginationParams();
            $companyId = $this->getQueryParam('company_id');
            $search = $this->getQueryParam('search');
            $category = $this->getQueryParam('category');
            $status = $this->getQueryParam('status');
            $lowStock = $this->getQueryParam('low_stock');
            
            $inventoryModel = new InventoryItem();
            
            // Build query based on user role
            $where = "1=1";
            $params = [];
            
            // Role-based filtering
            if ($this->user['role'] === 'partner') {
                $where .= " AND i.company_id IN (
                    SELECT company_id FROM company_partners 
                    WHERE user_id = :user_id AND status = 'active'
                )";
                $params['user_id'] = $this->user['id'];
            }
            
            if ($companyId) {
                if (!$this->canAccessCompany($companyId)) {
                    return;
                }
                $where .= " AND i.company_id = :company_id";
                $params['company_id'] = $companyId;
            }
            
            if ($search) {
                $where .= " AND (i.name LIKE :search OR i.sku LIKE :search OR i.description LIKE :search)";
                $params['search'] = "%{$search}%";
            }
            
            if ($category) {
                $where .= " AND i.category = :category";
                $params['category'] = $category;
            }
            
            if ($status) {
                $where .= " AND i.status = :status";
                $params['status'] = $status;
            }
            
            if ($lowStock === 'true') {
                $where .= " AND i.current_quantity <= i.min_stock_level";
            }
            
            $sql = "SELECT i.*, c.name as company_name, 
                           u1.name as created_by_name, u2.name as updated_by_name
                    FROM inventory_items i
                    LEFT JOIN companies c ON i.company_id = c.id
                    LEFT JOIN users u1 ON i.created_by = u1.id
                    LEFT JOIN users u2 ON i.updated_by = u2.id
                    WHERE {$where}
                    ORDER BY i.created_at DESC
                    LIMIT {$pagination['limit']} OFFSET {$pagination['offset']}";
            
            $countSql = "SELECT COUNT(*) as total FROM inventory_items i WHERE {$where}";
            
            $items = $this->db->fetchAll($sql, $params);
            $totalResult = $this->db->fetch($countSql, $params);
            $total = $totalResult['total'];
            
            Response::paginated($items, $total, $pagination['page'], $pagination['limit']);
        } catch (Exception $e) {
            logError('Get inventory failed: ' . $e->getMessage());
            Response::error('Failed to get inventory', 500);
        }
    }
    
    public function show($params) {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $inventoryModel = new InventoryItem();
            $item = $inventoryModel->getWithDetails($params['id']);
            
            if (!$item) {
                Response::notFound('Inventory item not found');
                return;
            }
            
            if (!$this->canAccessCompany($item['company_id'])) {
                return;
            }
            
            Response::success($item);
        } catch (Exception $e) {
            logError('Get inventory item failed: ' . $e->getMessage());
            Response::error('Failed to get inventory item', 500);
        }
    }
    
    public function store() {
        if (!$this->requireAuth()) {
            return;
        }
        
        $data = $this->getRequestData();
        
        $rules = [
            'name' => 'required|max:255',
            'company_id' => 'required|integer',
            'category' => 'required|max:100',
            'current_quantity' => 'required|numeric',
            'min_stock_level' => 'required|numeric',
            'unit_price' => 'required|numeric',
            'sku' => 'max:100',
            'description' => 'max:1000',
            'max_stock_level' => 'numeric',
            'status' => 'in:active,inactive,discontinued'
        ];
        
        if (!$this->validateAndRespond($data, $rules)) {
            return;
        }
        
        if (!$this->canAccessCompany($data['company_id'])) {
            return;
        }
        
        try {
            $inventoryModel = new InventoryItem();
            
            $data['created_by'] = $this->user['id'];
            $data['updated_by'] = $this->user['id'];
            $data['status'] = $data['status'] ?? 'active';
            
            $item = $inventoryModel->create($data);
            
            // Create initial transaction
            $this->createTransaction([
                'inventory_item_id' => $item['id'],
                'type' => 'adjustment',
                'quantity' => $data['current_quantity'],
                'unit_price' => $data['unit_price'],
                'previous_quantity' => 0,
                'new_quantity' => $data['current_quantity'],
                'description' => 'Initial inventory creation'
            ]);
            
            $this->logActivity('create', 'inventory_item', $item['id'], $data);
            
            Response::created($item, 'Inventory item created successfully');
        } catch (Exception $e) {
            logError('Create inventory item failed: ' . $e->getMessage());
            Response::error('Failed to create inventory item', 500);
        }
    }
    
    public function update($params) {
        if (!$this->requireAuth()) {
            return;
        }
        
        $data = $this->getRequestData();
        
        $rules = [
            'name' => 'max:255',
            'category' => 'max:100',
            'current_quantity' => 'numeric',
            'min_stock_level' => 'numeric',
            'unit_price' => 'numeric',
            'sku' => 'max:100',
            'description' => 'max:1000',
            'max_stock_level' => 'numeric',
            'status' => 'in:active,inactive,discontinued'
        ];
        
        if (!$this->validateAndRespond($data, $rules)) {
            return;
        }
        
        try {
            $inventoryModel = new InventoryItem();
            $oldItem = $inventoryModel->find($params['id']);
            
            if (!$oldItem) {
                Response::notFound('Inventory item not found');
                return;
            }
            
            if (!$this->canAccessCompany($oldItem['company_id'])) {
                return;
            }
            
            $data['updated_by'] = $this->user['id'];
            
            // Check if quantity changed
            if (isset($data['current_quantity']) && $data['current_quantity'] != $oldItem['current_quantity']) {
                $this->createTransaction([
                    'inventory_item_id' => $params['id'],
                    'type' => 'adjustment',
                    'quantity' => $data['current_quantity'] - $oldItem['current_quantity'],
                    'unit_price' => $data['unit_price'] ?? $oldItem['unit_price'],
                    'previous_quantity' => $oldItem['current_quantity'],
                    'new_quantity' => $data['current_quantity'],
                    'description' => 'Quantity adjustment'
                ]);
            }
            
            $item = $inventoryModel->update($params['id'], $data);
            
            $this->logActivity('update', 'inventory_item', $params['id'], [
                'old' => $oldItem,
                'new' => $data
            ]);
            
            Response::updated($item, 'Inventory item updated successfully');
        } catch (Exception $e) {
            logError('Update inventory item failed: ' . $e->getMessage());
            Response::error('Failed to update inventory item', 500);
        }
    }
    
    public function delete($params) {
        if (!$this->requireManager()) {
            return;
        }
        
        try {
            $inventoryModel = new InventoryItem();
            $item = $inventoryModel->find($params['id']);
            
            if (!$item) {
                Response::notFound('Inventory item not found');
                return;
            }
            
            if (!$this->canAccessCompany($item['company_id'])) {
                return;
            }
            
            $inventoryModel->delete($params['id']);
            
            $this->logActivity('delete', 'inventory_item', $params['id'], $item);
            
            Response::deleted('Inventory item deleted successfully');
        } catch (Exception $e) {
            logError('Delete inventory item failed: ' . $e->getMessage());
            Response::error('Failed to delete inventory item', 500);
        }
    }
    
    public function getLowStock() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $inventoryModel = new InventoryItem();
            $items = $inventoryModel->getLowStockItems($this->user);
            
            Response::success($items);
        } catch (Exception $e) {
            logError('Get low stock items failed: ' . $e->getMessage());
            Response::error('Failed to get low stock items', 500);
        }
    }
    
    private function createTransaction($data) {
        $data['performed_by'] = $this->user['id'];
        $data['transaction_date'] = date('Y-m-d H:i:s');
        
        return $this->db->insert('inventory_transactions', $data);
    }
}
