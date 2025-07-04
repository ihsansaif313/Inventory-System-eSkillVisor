<?php
/**
 * Base Controller Class
 */

abstract class Controller {
    protected $db;
    protected $user;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->user = Auth::user();
    }
    
    protected function getRequestData() {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (json_last_error() === JSON_ERROR_NONE) {
            return $data;
        }
        
        return $_POST;
    }
    
    protected function getQueryParams() {
        return $_GET;
    }
    
    protected function getParam($key, $default = null) {
        $data = $this->getRequestData();
        return $data[$key] ?? $default;
    }
    
    protected function getQueryParam($key, $default = null) {
        return $_GET[$key] ?? $default;
    }
    
    protected function validate($data, $rules) {
        $errors = [];
        
        foreach ($rules as $field => $rule) {
            $value = $data[$field] ?? null;
            $ruleList = explode('|', $rule);
            
            foreach ($ruleList as $singleRule) {
                $ruleParts = explode(':', $singleRule);
                $ruleName = $ruleParts[0];
                $ruleValue = $ruleParts[1] ?? null;
                
                switch ($ruleName) {
                    case 'required':
                        if (empty($value)) {
                            $errors[$field][] = ucfirst($field) . ' is required';
                        }
                        break;
                        
                    case 'email':
                        if (!empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $errors[$field][] = ucfirst($field) . ' must be a valid email';
                        }
                        break;
                        
                    case 'min':
                        if (!empty($value) && strlen($value) < $ruleValue) {
                            $errors[$field][] = ucfirst($field) . " must be at least {$ruleValue} characters";
                        }
                        break;
                        
                    case 'max':
                        if (!empty($value) && strlen($value) > $ruleValue) {
                            $errors[$field][] = ucfirst($field) . " must not exceed {$ruleValue} characters";
                        }
                        break;
                        
                    case 'numeric':
                        if (!empty($value) && !is_numeric($value)) {
                            $errors[$field][] = ucfirst($field) . ' must be a number';
                        }
                        break;
                        
                    case 'integer':
                        if (!empty($value) && !filter_var($value, FILTER_VALIDATE_INT)) {
                            $errors[$field][] = ucfirst($field) . ' must be an integer';
                        }
                        break;
                        
                    case 'in':
                        $allowedValues = explode(',', $ruleValue);
                        if (!empty($value) && !in_array($value, $allowedValues)) {
                            $errors[$field][] = ucfirst($field) . ' must be one of: ' . implode(', ', $allowedValues);
                        }
                        break;
                        
                    case 'unique':
                        if (!empty($value)) {
                            $tableParts = explode(',', $ruleValue);
                            $table = $tableParts[0];
                            $column = $tableParts[1] ?? $field;
                            $excludeId = $tableParts[2] ?? null;
                            
                            $sql = "SELECT COUNT(*) as count FROM {$table} WHERE {$column} = :value";
                            $params = ['value' => $value];
                            
                            if ($excludeId) {
                                $sql .= " AND id != :exclude_id";
                                $params['exclude_id'] = $excludeId;
                            }
                            
                            $result = $this->db->fetch($sql, $params);
                            if ($result['count'] > 0) {
                                $errors[$field][] = ucfirst($field) . ' already exists';
                            }
                        }
                        break;
                }
            }
        }
        
        return $errors;
    }
    
    protected function validateAndRespond($data, $rules) {
        $errors = $this->validate($data, $rules);
        
        if (!empty($errors)) {
            Response::error('Validation failed', 422, ['errors' => $errors]);
            return false;
        }
        
        return true;
    }
    
    protected function requireAuth() {
        if (!Auth::check()) {
            Response::error('Authentication required', 401);
            return false;
        }
        return true;
    }
    
    protected function requireRole($roles) {
        if (!$this->requireAuth()) {
            return false;
        }
        
        if (is_string($roles)) {
            $roles = [$roles];
        }
        
        if (!in_array($this->user['role'], $roles)) {
            Response::error('Insufficient permissions', 403);
            return false;
        }
        
        return true;
    }
    
    protected function requireSuperAdmin() {
        return $this->requireRole('superadmin');
    }
    
    protected function requireManager() {
        return $this->requireRole(['superadmin', 'manager']);
    }
    
    protected function canAccessCompany($companyId) {
        if (!$this->requireAuth()) {
            return false;
        }
        
        // Superadmin and manager can access all companies
        if (in_array($this->user['role'], ['superadmin', 'manager'])) {
            return true;
        }
        
        // Partner can only access assigned companies
        if ($this->user['role'] === 'partner') {
            $sql = "SELECT COUNT(*) as count FROM company_partners WHERE user_id = :user_id AND company_id = :company_id";
            $result = $this->db->fetch($sql, [
                'user_id' => $this->user['id'],
                'company_id' => $companyId
            ]);
            
            if ($result['count'] == 0) {
                Response::error('Access denied to this company', 403);
                return false;
            }
        }
        
        return true;
    }
    
    protected function getPaginationParams() {
        $page = max(1, (int)$this->getQueryParam('page', 1));
        $limit = min(MAX_PAGE_SIZE, max(1, (int)$this->getQueryParam('limit', DEFAULT_PAGE_SIZE)));
        $offset = ($page - 1) * $limit;
        
        return [
            'page' => $page,
            'limit' => $limit,
            'offset' => $offset
        ];
    }
    
    protected function buildPaginatedResponse($data, $total, $page, $limit) {
        $totalPages = ceil($total / $limit);
        
        return [
            'data' => $data,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1
            ]
        ];
    }
    
    protected function logActivity($action, $entityType, $entityId, $changes = null) {
        $auditData = [
            'performed_by' => $this->user['id'] ?? null,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_values' => null,
            'new_values' => $changes ? json_encode($changes) : null,
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
        ];

        $this->db->insert('audit_trail', $auditData);
    }
}
