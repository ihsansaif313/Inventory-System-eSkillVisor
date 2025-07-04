<?php
/**
 * User Management Controller
 */

class UserController extends Controller {
    
    public function index() {
        if (!$this->requireManager()) {
            return;
        }
        
        try {
            $pagination = $this->getPaginationParams();
            $search = $this->getQueryParam('search');
            $role = $this->getQueryParam('role');
            $status = $this->getQueryParam('status');
            
            $userModel = new User();
            
            // Build query
            $where = "1=1";
            $params = [];
            
            if ($search) {
                $where .= " AND (name LIKE :search OR email LIKE :search)";
                $params['search'] = "%{$search}%";
            }
            
            if ($role) {
                $where .= " AND role = :role";
                $params['role'] = $role;
            }
            
            if ($status) {
                $where .= " AND status = :status";
                $params['status'] = $status;
            }
            
            $result = $userModel->paginate(
                $pagination['page'],
                $pagination['limit'],
                'created_at',
                'DESC',
                $where,
                $params
            );
            
            Response::paginated($result['data'], $result['total'], $result['page'], $result['limit']);
        } catch (Exception $e) {
            logError('Get users failed: ' . $e->getMessage());
            Response::error('Failed to get users', 500);
        }
    }
    
    public function show($params) {
        if (!$this->requireManager()) {
            return;
        }
        
        try {
            $userModel = new User();
            $user = $userModel->find($params['id']);
            
            if (!$user) {
                Response::notFound('User not found');
                return;
            }
            
            // Get assigned companies for partners
            if ($user['role'] === 'partner') {
                $user['assigned_companies'] = $userModel->getUserCompanies($user['id']);
            }
            
            Response::success($user);
        } catch (Exception $e) {
            logError('Get user failed: ' . $e->getMessage());
            Response::error('Failed to get user', 500);
        }
    }
    
    public function store() {
        if (!$this->requireManager()) {
            return;
        }
        
        $data = $this->getRequestData();
        
        $rules = [
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role' => 'required|in:superadmin,manager,partner',
            'status' => 'in:active,inactive'
        ];
        
        if (!$this->validateAndRespond($data, $rules)) {
            return;
        }
        
        try {
            $userModel = new User();
            
            // Hash password
            $data['password'] = Auth::hashPassword($data['password']);
            $data['status'] = $data['status'] ?? 'active';
            $data['email_verified_at'] = date('Y-m-d H:i:s');
            
            $user = $userModel->create($data);
            
            $this->logActivity('create', 'user', $user['id'], $data);
            
            Response::created($user, 'User created successfully');
        } catch (Exception $e) {
            logError('Create user failed: ' . $e->getMessage());
            Response::error('Failed to create user', 500);
        }
    }
    
    public function update($params) {
        if (!$this->requireManager()) {
            return;
        }
        
        $data = $this->getRequestData();
        
        $rules = [
            'name' => 'max:255',
            'email' => 'email|unique:users,email,' . $params['id'],
            'role' => 'in:superadmin,manager,partner',
            'status' => 'in:active,inactive,suspended'
        ];
        
        if (!$this->validateAndRespond($data, $rules)) {
            return;
        }
        
        try {
            $userModel = new User();
            $oldUser = $userModel->find($params['id']);
            
            if (!$oldUser) {
                Response::notFound('User not found');
                return;
            }
            
            // Hash password if provided
            if (isset($data['password'])) {
                $data['password'] = Auth::hashPassword($data['password']);
            }
            
            $user = $userModel->update($params['id'], $data);
            
            $this->logActivity('update', 'user', $params['id'], [
                'old' => $oldUser,
                'new' => $data
            ]);
            
            Response::updated($user, 'User updated successfully');
        } catch (Exception $e) {
            logError('Update user failed: ' . $e->getMessage());
            Response::error('Failed to update user', 500);
        }
    }
    
    public function delete($params) {
        if (!$this->requireSuperAdmin()) {
            return;
        }
        
        try {
            $userModel = new User();
            $user = $userModel->find($params['id']);
            
            if (!$user) {
                Response::notFound('User not found');
                return;
            }
            
            // Don't allow deleting yourself
            if ($user['id'] == $this->user['id']) {
                Response::error('Cannot delete your own account', 400);
                return;
            }
            
            $userModel->delete($params['id']);
            
            $this->logActivity('delete', 'user', $params['id'], $user);
            
            Response::deleted('User deleted successfully');
        } catch (Exception $e) {
            logError('Delete user failed: ' . $e->getMessage());
            Response::error('Failed to delete user', 500);
        }
    }
}
