<?php
/**
 * Company Model
 */

class Company extends Model {
    protected $table = 'companies';
    protected $fillable = [
        'name',
        'description',
        'industry',
        'website',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'status',
        'created_by'
    ];
    
    public function getWithStats($id) {
        $sql = "SELECT c.*,
                       COUNT(DISTINCT i.id) as inventory_count,
                       COALESCE(SUM(i.current_quantity * i.unit_price), 0) as total_inventory_value,
                       COUNT(DISTINCT cp.user_id) as partner_count,
                       u.name as created_by_name
                FROM companies c
                LEFT JOIN inventory_items i ON c.id = i.company_id AND i.status = 'active'
                LEFT JOIN company_partners cp ON c.id = cp.company_id AND cp.status = 'active'
                LEFT JOIN users u ON c.created_by = u.id
                WHERE c.id = :id
                GROUP BY c.id";
        
        return $this->fetch($sql, ['id' => $id]);
    }
    
    public function getPartners($companyId) {
        $sql = "SELECT u.id, u.name, u.email, cp.assigned_at, cp.status,
                       ua.name as assigned_by_name
                FROM users u
                JOIN company_partners cp ON u.id = cp.user_id
                LEFT JOIN users ua ON cp.assigned_by = ua.id
                WHERE cp.company_id = :company_id
                ORDER BY cp.assigned_at DESC";
        
        return $this->fetchAll($sql, ['company_id' => $companyId]);
    }
    
    public function assignPartner($companyId, $userId, $assignedBy = null) {
        try {
            $this->beginTransaction();
            
            // Check if assignment already exists
            $sql = "SELECT id FROM company_partners WHERE company_id = :company_id AND user_id = :user_id";
            $existing = $this->fetch($sql, ['company_id' => $companyId, 'user_id' => $userId]);
            
            if ($existing) {
                // Update existing assignment
                $this->db->update('company_partners', 
                    [
                        'status' => 'active',
                        'assigned_by' => $assignedBy,
                        'assigned_at' => date('Y-m-d H:i:s')
                    ],
                    'id = :id',
                    ['id' => $existing['id']]
                );
            } else {
                // Create new assignment
                $this->db->insert('company_partners', [
                    'company_id' => $companyId,
                    'user_id' => $userId,
                    'assigned_by' => $assignedBy,
                    'status' => 'active',
                    'assigned_at' => date('Y-m-d H:i:s')
                ]);
            }
            
            $this->commit();
            return true;
        } catch (Exception $e) {
            $this->rollback();
            throw $e;
        }
    }
    
    public function removePartner($companyId, $userId) {
        return $this->db->update('company_partners',
            ['status' => 'inactive'],
            'company_id = :company_id AND user_id = :user_id',
            ['company_id' => $companyId, 'user_id' => $userId]
        );
    }
    
    public function getUserCompanies($userId) {
        $sql = "SELECT c.*, cp.assigned_at, cp.status as assignment_status,
                       COUNT(DISTINCT i.id) as inventory_count,
                       COALESCE(SUM(i.current_quantity * i.unit_price), 0) as total_value
                FROM companies c
                JOIN company_partners cp ON c.id = cp.company_id
                LEFT JOIN inventory_items i ON c.id = i.company_id AND i.status = 'active'
                WHERE cp.user_id = :user_id AND cp.status = 'active'
                GROUP BY c.id
                ORDER BY c.name";
        
        return $this->fetchAll($sql, ['user_id' => $userId]);
    }
    
    public function getStats() {
        $sql = "SELECT 
                    COUNT(*) as total_companies,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_companies,
                    COUNT(DISTINCT cp.user_id) as total_partners,
                    COUNT(DISTINCT i.id) as total_inventory_items,
                    COALESCE(SUM(i.current_quantity * i.unit_price), 0) as total_inventory_value
                FROM companies c
                LEFT JOIN company_partners cp ON c.id = cp.company_id AND cp.status = 'active'
                LEFT JOIN inventory_items i ON c.id = i.company_id AND i.status = 'active'
                WHERE c.status = 'active'";
        
        return $this->fetch($sql);
    }
    
    public function getTopCompaniesByValue($limit = 10) {
        $sql = "SELECT c.name, c.id,
                       COUNT(DISTINCT i.id) as inventory_count,
                       COALESCE(SUM(i.current_quantity * i.unit_price), 0) as total_value
                FROM companies c
                LEFT JOIN inventory_items i ON c.id = i.company_id AND i.status = 'active'
                WHERE c.status = 'active'
                GROUP BY c.id
                ORDER BY total_value DESC
                LIMIT {$limit}";
        
        return $this->fetchAll($sql);
    }
    
    public function searchCompanies($query, $status = null) {
        $sql = "SELECT c.*, 
                       COUNT(DISTINCT i.id) as inventory_count,
                       COUNT(DISTINCT cp.user_id) as partner_count
                FROM companies c
                LEFT JOIN inventory_items i ON c.id = i.company_id AND i.status = 'active'
                LEFT JOIN company_partners cp ON c.id = cp.company_id AND cp.status = 'active'
                WHERE (c.name LIKE :query OR c.description LIKE :query)";
        
        $params = ['query' => "%{$query}%"];
        
        if ($status) {
            $sql .= " AND c.status = :status";
            $params['status'] = $status;
        }
        
        $sql .= " GROUP BY c.id ORDER BY c.name";
        
        return $this->fetchAll($sql, $params);
    }
    
    public function getIndustries() {
        $sql = "SELECT DISTINCT industry FROM companies WHERE industry IS NOT NULL AND industry != '' ORDER BY industry";
        $results = $this->fetchAll($sql);
        return array_column($results, 'industry');
    }
}
