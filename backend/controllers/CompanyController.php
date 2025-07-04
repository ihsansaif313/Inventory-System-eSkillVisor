<?php
/**
 * Company Management Controller
 */

class CompanyController extends Controller {
    
    public function index() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $pagination = $this->getPaginationParams();
            $search = $this->getQueryParam('search');
            $status = $this->getQueryParam('status');
            
            $companyModel = new Company();
            
            // Build query based on user role
            $where = "c.status = 'active'";
            $params = [];
            
            // Role-based filtering
            if ($this->user['role'] === 'partner') {
                $where .= " AND c.id IN (
                    SELECT company_id FROM company_partners 
                    WHERE user_id = :user_id AND status = 'active'
                )";
                $params['user_id'] = $this->user['id'];
            }
            
            if ($search) {
                $where .= " AND (c.name LIKE :search OR c.description LIKE :search)";
                $params['search'] = "%{$search}%";
            }
            
            if ($status) {
                $where = str_replace("c.status = 'active'", "c.status = :status", $where);
                $params['status'] = $status;
            }
            
            $sql = "SELECT c.*, 
                           COUNT(DISTINCT i.id) as inventory_count,
                           COALESCE(SUM(i.current_quantity * i.unit_price), 0) as total_value,
                           COUNT(DISTINCT cp.user_id) as partner_count
                    FROM companies c
                    LEFT JOIN inventory_items i ON c.id = i.company_id AND i.status = 'active'
                    LEFT JOIN company_partners cp ON c.id = cp.company_id AND cp.status = 'active'
                    WHERE {$where}
                    GROUP BY c.id
                    ORDER BY c.name
                    LIMIT {$pagination['limit']} OFFSET {$pagination['offset']}";
            
            $countSql = "SELECT COUNT(DISTINCT c.id) as total FROM companies c WHERE {$where}";
            
            $companies = $this->db->fetchAll($sql, $params);
            $totalResult = $this->db->fetch($countSql, $params);
            $total = $totalResult['total'];
            
            Response::paginated($companies, $total, $pagination['page'], $pagination['limit']);
        } catch (Exception $e) {
            logError('Get companies failed: ' . $e->getMessage());
            Response::error('Failed to get companies', 500);
        }
    }
    
    public function show($params) {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $companyModel = new Company();
            $company = $companyModel->getWithStats($params['id']);
            
            if (!$company) {
                Response::notFound('Company not found');
                return;
            }
            
            if (!$this->canAccessCompany($params['id'])) {
                return;
            }
            
            // Get partners for this company
            $company['partners'] = $companyModel->getPartners($params['id']);
            
            Response::success($company);
        } catch (Exception $e) {
            logError('Get company failed: ' . $e->getMessage());
            Response::error('Failed to get company', 500);
        }
    }
    
    public function store() {
        if (!$this->requireManager()) {
            return;
        }
        
        $data = $this->getRequestData();
        
        $rules = [
            'name' => 'required|max:255',
            'description' => 'max:1000',
            'industry' => 'max:100',
            'website' => 'max:255',
            'email' => 'email|max:255',
            'phone' => 'max:50',
            'status' => 'in:active,inactive'
        ];
        
        if (!$this->validateAndRespond($data, $rules)) {
            return;
        }
        
        try {
            $companyModel = new Company();
            
            $data['created_by'] = $this->user['id'];
            $data['status'] = $data['status'] ?? 'active';
            
            $company = $companyModel->create($data);
            
            $this->logActivity('create', 'company', $company['id'], $data);
            
            Response::created($company, 'Company created successfully');
        } catch (Exception $e) {
            logError('Create company failed: ' . $e->getMessage());
            Response::error('Failed to create company', 500);
        }
    }
    
    public function update($params) {
        if (!$this->requireManager()) {
            return;
        }
        
        $data = $this->getRequestData();
        
        $rules = [
            'name' => 'max:255',
            'description' => 'max:1000',
            'industry' => 'max:100',
            'website' => 'max:255',
            'email' => 'email|max:255',
            'phone' => 'max:50',
            'status' => 'in:active,inactive'
        ];
        
        if (!$this->validateAndRespond($data, $rules)) {
            return;
        }
        
        try {
            $companyModel = new Company();
            $oldCompany = $companyModel->find($params['id']);
            
            if (!$oldCompany) {
                Response::notFound('Company not found');
                return;
            }
            
            $company = $companyModel->update($params['id'], $data);
            
            $this->logActivity('update', 'company', $params['id'], [
                'old' => $oldCompany,
                'new' => $data
            ]);
            
            Response::updated($company, 'Company updated successfully');
        } catch (Exception $e) {
            logError('Update company failed: ' . $e->getMessage());
            Response::error('Failed to update company', 500);
        }
    }
    
    public function delete($params) {
        if (!$this->requireSuperAdmin()) {
            return;
        }
        
        try {
            $companyModel = new Company();
            $company = $companyModel->find($params['id']);
            
            if (!$company) {
                Response::notFound('Company not found');
                return;
            }
            
            $companyModel->delete($params['id']);
            
            $this->logActivity('delete', 'company', $params['id'], $company);
            
            Response::deleted('Company deleted successfully');
        } catch (Exception $e) {
            logError('Delete company failed: ' . $e->getMessage());
            Response::error('Failed to delete company', 500);
        }
    }
    
    public function getPartners($params) {
        if (!$this->requireManager()) {
            return;
        }
        
        try {
            $companyModel = new Company();
            $partners = $companyModel->getPartners($params['id']);
            
            Response::success($partners);
        } catch (Exception $e) {
            logError('Get company partners failed: ' . $e->getMessage());
            Response::error('Failed to get company partners', 500);
        }
    }
    
    public function assignPartner($params) {
        if (!$this->requireManager()) {
            return;
        }
        
        $data = $this->getRequestData();
        
        $rules = [
            'user_id' => 'required|integer'
        ];
        
        if (!$this->validateAndRespond($data, $rules)) {
            return;
        }
        
        try {
            $companyModel = new Company();
            
            $success = $companyModel->assignPartner(
                $params['id'], 
                $data['user_id'], 
                $this->user['id']
            );
            
            if ($success) {
                $this->logActivity('assign_partner', 'company', $params['id'], [
                    'partner_id' => $data['user_id']
                ]);
                
                Response::success(null, 'Partner assigned successfully');
            } else {
                Response::error('Failed to assign partner', 500);
            }
        } catch (Exception $e) {
            logError('Assign partner failed: ' . $e->getMessage());
            Response::error('Failed to assign partner', 500);
        }
    }
    
    public function removePartner($params) {
        if (!$this->requireManager()) {
            return;
        }
        
        try {
            $companyModel = new Company();
            
            $success = $companyModel->removePartner($params['id'], $params['partnerId']);
            
            if ($success) {
                $this->logActivity('remove_partner', 'company', $params['id'], [
                    'partner_id' => $params['partnerId']
                ]);
                
                Response::success(null, 'Partner removed successfully');
            } else {
                Response::error('Failed to remove partner', 500);
            }
        } catch (Exception $e) {
            logError('Remove partner failed: ' . $e->getMessage());
            Response::error('Failed to remove partner', 500);
        }
    }
}
