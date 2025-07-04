<?php
/**
 * Inventory Item Model
 */

class InventoryItem extends Model {
    protected $table = 'inventory_items';
    protected $fillable = [
        'name', 
        'description', 
        'sku', 
        'category',
        'current_quantity',
        'min_stock_level',
        'max_stock_level',
        'unit_price',
        'company_id',
        'status',
        'created_by',
        'updated_by'
    ];
    
    public function getWithDetails($id) {
        $sql = "SELECT i.*, c.name as company_name, 
                       u1.name as created_by_name, u2.name as updated_by_name
                FROM inventory_items i
                LEFT JOIN companies c ON i.company_id = c.id
                LEFT JOIN users u1 ON i.created_by = u1.id
                LEFT JOIN users u2 ON i.updated_by = u2.id
                WHERE i.id = :id";
        
        return $this->fetch($sql, ['id' => $id]);
    }
    
    public function getByCompany($companyId) {
        return $this->where('company_id', $companyId);
    }
    
    public function getLowStockItems($user = null) {
        $sql = "SELECT i.*, c.name as company_name
                FROM inventory_items i
                LEFT JOIN companies c ON i.company_id = c.id
                WHERE i.current_quantity <= i.min_stock_level 
                AND i.status = 'active'";
        
        $params = [];
        
        // Filter by user role
        if ($user && $user['role'] === 'partner') {
            $sql .= " AND i.company_id IN (
                SELECT company_id FROM company_partners 
                WHERE user_id = :user_id AND status = 'active'
            )";
            $params['user_id'] = $user['id'];
        }
        
        $sql .= " ORDER BY (i.current_quantity / i.min_stock_level) ASC";
        
        return $this->fetchAll($sql, $params);
    }
    
    public function getCategories($user = null) {
        $sql = "SELECT DISTINCT category FROM inventory_items WHERE status = 'active'";
        $params = [];
        
        if ($user && $user['role'] === 'partner') {
            $sql .= " AND company_id IN (
                SELECT company_id FROM company_partners 
                WHERE user_id = :user_id AND status = 'active'
            )";
            $params['user_id'] = $user['id'];
        }
        
        $sql .= " ORDER BY category";
        
        $results = $this->fetchAll($sql, $params);
        return array_column($results, 'category');
    }
    
    public function getStats($user = null) {
        $sql = "SELECT 
                    COUNT(*) as total_items,
                    SUM(current_quantity * unit_price) as total_value,
                    SUM(CASE WHEN current_quantity <= min_stock_level THEN 1 ELSE 0 END) as low_stock_items,
                    COUNT(DISTINCT company_id) as companies_count,
                    AVG(unit_price) as avg_unit_price
                FROM inventory_items 
                WHERE status = 'active'";
        
        $params = [];
        
        if ($user && $user['role'] === 'partner') {
            $sql .= " AND company_id IN (
                SELECT company_id FROM company_partners 
                WHERE user_id = :user_id AND status = 'active'
            )";
            $params['user_id'] = $user['id'];
        }
        
        return $this->fetch($sql, $params);
    }
    
    public function getTopCategories($user = null, $limit = 5) {
        $sql = "SELECT 
                    category,
                    COUNT(*) as count,
                    SUM(current_quantity * unit_price) as value
                FROM inventory_items 
                WHERE status = 'active'";
        
        $params = [];
        
        if ($user && $user['role'] === 'partner') {
            $sql .= " AND company_id IN (
                SELECT company_id FROM company_partners 
                WHERE user_id = :user_id AND status = 'active'
            )";
            $params['user_id'] = $user['id'];
        }
        
        $sql .= " GROUP BY category 
                  ORDER BY value DESC 
                  LIMIT {$limit}";
        
        return $this->fetchAll($sql, $params);
    }
    
    public function updateQuantity($id, $newQuantity, $userId, $description = null) {
        try {
            $this->beginTransaction();
            
            $oldItem = $this->find($id);
            if (!$oldItem) {
                throw new Exception('Inventory item not found');
            }
            
            // Update quantity
            $this->update($id, [
                'current_quantity' => $newQuantity,
                'updated_by' => $userId
            ]);
            
            // Create transaction record
            $this->db->insert('inventory_transactions', [
                'inventory_item_id' => $id,
                'type' => 'adjustment',
                'quantity' => $newQuantity - $oldItem['current_quantity'],
                'unit_price' => $oldItem['unit_price'],
                'previous_quantity' => $oldItem['current_quantity'],
                'new_quantity' => $newQuantity,
                'description' => $description ?: 'Quantity adjustment',
                'performed_by' => $userId,
                'transaction_date' => date('Y-m-d H:i:s')
            ]);
            
            $this->commit();
            return true;
        } catch (Exception $e) {
            $this->rollback();
            throw $e;
        }
    }
    
    public function searchItems($query, $user = null) {
        $sql = "SELECT i.*, c.name as company_name
                FROM inventory_items i
                LEFT JOIN companies c ON i.company_id = c.id
                WHERE (i.name LIKE :query OR i.sku LIKE :query OR i.description LIKE :query)
                AND i.status = 'active'";
        
        $params = ['query' => "%{$query}%"];
        
        if ($user && $user['role'] === 'partner') {
            $sql .= " AND i.company_id IN (
                SELECT company_id FROM company_partners 
                WHERE user_id = :user_id AND status = 'active'
            )";
            $params['user_id'] = $user['id'];
        }
        
        $sql .= " ORDER BY i.name LIMIT 20";
        
        return $this->fetchAll($sql, $params);
    }
}
