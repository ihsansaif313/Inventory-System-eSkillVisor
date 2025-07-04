<?php
/**
 * User Model
 */

class User extends Model {
    protected $table = 'users';
    protected $fillable = [
        'name', 
        'email', 
        'password', 
        'role', 
        'status',
        'email_verified_at',
        'last_login'
    ];
    protected $hidden = ['password'];
    
    public function findByEmail($email) {
        return $this->whereFirst('email', $email);
    }
    
    public function getActiveUsers() {
        return $this->where('status', 'active');
    }
    
    public function getUsersByRole($role) {
        $sql = "SELECT * FROM {$this->table} WHERE role = :role AND status = 'active' ORDER BY name";
        return $this->fetchAll($sql, ['role' => $role]);
    }
    
    public function getPartners() {
        return $this->getUsersByRole('partner');
    }
    
    public function getManagers() {
        return $this->getUsersByRole('manager');
    }
    
    public function getSuperAdmins() {
        return $this->getUsersByRole('superadmin');
    }
    
    public function getPartnersWithCompanies() {
        $sql = "SELECT u.*, 
                       GROUP_CONCAT(c.name SEPARATOR ', ') as company_names,
                       COUNT(cp.company_id) as company_count
                FROM users u
                LEFT JOIN company_partners cp ON u.id = cp.user_id AND cp.status = 'active'
                LEFT JOIN companies c ON cp.company_id = c.id
                WHERE u.role = 'partner' AND u.status = 'active'
                GROUP BY u.id
                ORDER BY u.name";
        
        return $this->fetchAll($sql);
    }
    
    public function getUserCompanies($userId) {
        $sql = "SELECT c.*, cp.assigned_at, cp.status as assignment_status
                FROM companies c
                JOIN company_partners cp ON c.id = cp.company_id
                WHERE cp.user_id = :user_id
                ORDER BY c.name";
        
        return $this->fetchAll($sql, ['user_id' => $userId]);
    }
    
    public function assignToCompany($userId, $companyId, $assignedBy = null) {
        try {
            $this->beginTransaction();
            
            // Check if assignment already exists
            $sql = "SELECT id FROM company_partners WHERE user_id = :user_id AND company_id = :company_id";
            $existing = $this->fetch($sql, ['user_id' => $userId, 'company_id' => $companyId]);
            
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
                    'user_id' => $userId,
                    'company_id' => $companyId,
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
    
    public function removeFromCompany($userId, $companyId) {
        return $this->db->update('company_partners',
            ['status' => 'inactive'],
            'user_id = :user_id AND company_id = :company_id',
            ['user_id' => $userId, 'company_id' => $companyId]
        );
    }
    
    public function canAccessCompany($userId, $companyId) {
        $user = $this->find($userId);
        
        if (!$user) {
            return false;
        }
        
        // Superadmin and manager can access all companies
        if (in_array($user['role'], ['superadmin', 'manager'])) {
            return true;
        }
        
        // Partner can only access assigned companies
        if ($user['role'] === 'partner') {
            $sql = "SELECT COUNT(*) as count FROM company_partners 
                    WHERE user_id = :user_id AND company_id = :company_id AND status = 'active'";
            $result = $this->fetch($sql, ['user_id' => $userId, 'company_id' => $companyId]);
            return $result['count'] > 0;
        }
        
        return false;
    }
    
    public function updateLastLogin($userId) {
        return $this->update($userId, ['last_login' => date('Y-m-d H:i:s')]);
    }
    
    public function changePassword($userId, $newPassword) {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        return $this->update($userId, ['password' => $hashedPassword]);
    }
    
    public function verifyPassword($userId, $password) {
        $user = $this->find($userId);
        if (!$user) {
            return false;
        }
        
        return password_verify($password, $user['password']);
    }
    
    public function activate($userId) {
        return $this->update($userId, ['status' => 'active']);
    }
    
    public function deactivate($userId) {
        return $this->update($userId, ['status' => 'inactive']);
    }
    
    public function suspend($userId) {
        return $this->update($userId, ['status' => 'suspended']);
    }
    
    public function getStats() {
        $sql = "SELECT 
                    COUNT(*) as total_users,
                    SUM(CASE WHEN role = 'superadmin' THEN 1 ELSE 0 END) as superadmins,
                    SUM(CASE WHEN role = 'manager' THEN 1 ELSE 0 END) as managers,
                    SUM(CASE WHEN role = 'partner' THEN 1 ELSE 0 END) as partners,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
                    SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_users,
                    SUM(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as recent_logins
                FROM users";
        
        return $this->fetch($sql);
    }
    
    public function searchUsers($query, $role = null, $status = null) {
        $sql = "SELECT * FROM users WHERE (name LIKE :query OR email LIKE :query)";
        $params = ['query' => "%{$query}%"];
        
        if ($role) {
            $sql .= " AND role = :role";
            $params['role'] = $role;
        }
        
        if ($status) {
            $sql .= " AND status = :status";
            $params['status'] = $status;
        }
        
        $sql .= " ORDER BY name";
        
        return $this->fetchAll($sql, $params);
    }
}
