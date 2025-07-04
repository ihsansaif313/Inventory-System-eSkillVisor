<?php
/**
 * File Upload and Processing Controller
 */

class FileController extends Controller {
    
    public function upload() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            if (!isset($_FILES['file'])) {
                Response::error('No file uploaded', 400);
                return;
            }
            
            $file = $_FILES['file'];
            
            // Validate file
            if ($file['error'] !== UPLOAD_ERR_OK) {
                Response::error('File upload error', 400);
                return;
            }
            
            if ($file['size'] > UPLOAD_MAX_SIZE) {
                Response::error('File size exceeds limit', 400);
                return;
            }
            
            $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            if (!in_array($fileExtension, UPLOAD_ALLOWED_TYPES)) {
                Response::error('File type not allowed', 400);
                return;
            }
            
            // Generate unique filename
            $storedName = 'upload_' . time() . '_' . uniqid() . '.' . $fileExtension;
            $filePath = UPLOAD_PATH . $storedName;
            
            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $filePath)) {
                Response::error('Failed to save file', 500);
                return;
            }
            
            // Save file record to database
            $fileData = [
                'original_name' => $file['name'],
                'stored_name' => $storedName,
                'file_path' => $filePath,
                'file_type' => $fileExtension,
                'file_size' => $file['size'],
                'mime_type' => $file['type'],
                'status' => 'uploaded',
                'uploaded_by' => $this->user['id'],
                'created_at' => date('Y-m-d H:i:s')
            ];
            
            $fileId = $this->db->insert('file_uploads', $fileData);
            
            $this->logActivity('upload_file', 'file_upload', $fileId, $fileData);
            
            Response::created([
                'id' => $fileId,
                'original_name' => $file['name'],
                'file_type' => $fileExtension,
                'file_size' => $file['size'],
                'status' => 'uploaded'
            ], 'File uploaded successfully');
            
        } catch (Exception $e) {
            logError('File upload failed: ' . $e->getMessage());
            Response::error('File upload failed', 500);
        }
    }
    
    public function getUploads() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $pagination = $this->getPaginationParams();
            
            $where = "1=1";
            $params = [];
            
            // Partners can only see their own uploads
            if ($this->user['role'] === 'partner') {
                $where .= " AND uploaded_by = :user_id";
                $params['user_id'] = $this->user['id'];
            }
            
            $sql = "SELECT fu.*, u.name as uploaded_by_name
                    FROM file_uploads fu
                    LEFT JOIN users u ON fu.uploaded_by = u.id
                    WHERE {$where}
                    ORDER BY fu.created_at DESC
                    LIMIT {$pagination['limit']} OFFSET {$pagination['offset']}";
            
            $countSql = "SELECT COUNT(*) as total FROM file_uploads fu WHERE {$where}";
            
            $uploads = $this->db->fetchAll($sql, $params);
            $totalResult = $this->db->fetch($countSql, $params);
            $total = $totalResult['total'];
            
            Response::paginated($uploads, $total, $pagination['page'], $pagination['limit']);
        } catch (Exception $e) {
            logError('Get uploads failed: ' . $e->getMessage());
            Response::error('Failed to get uploads', 500);
        }
    }
    
    public function getUpload($params) {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $sql = "SELECT fu.*, u.name as uploaded_by_name
                    FROM file_uploads fu
                    LEFT JOIN users u ON fu.uploaded_by = u.id
                    WHERE fu.id = :id";
            
            $upload = $this->db->fetch($sql, ['id' => $params['id']]);
            
            if (!$upload) {
                Response::notFound('Upload not found');
                return;
            }
            
            // Partners can only see their own uploads
            if ($this->user['role'] === 'partner' && $upload['uploaded_by'] != $this->user['id']) {
                Response::forbidden('Access denied');
                return;
            }
            
            Response::success($upload);
        } catch (Exception $e) {
            logError('Get upload failed: ' . $e->getMessage());
            Response::error('Failed to get upload', 500);
        }
    }
    
    public function processFile($params) {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $upload = $this->db->fetch("SELECT * FROM file_uploads WHERE id = :id", ['id' => $params['id']]);
            
            if (!$upload) {
                Response::notFound('Upload not found');
                return;
            }
            
            // Partners can only process their own uploads
            if ($this->user['role'] === 'partner' && $upload['uploaded_by'] != $this->user['id']) {
                Response::forbidden('Access denied');
                return;
            }
            
            if ($upload['status'] !== 'uploaded') {
                Response::error('File already processed or processing', 400);
                return;
            }
            
            // Update status to processing
            $this->db->update('file_uploads', 
                ['status' => 'processing', 'processed_at' => date('Y-m-d H:i:s')],
                'id = :id',
                ['id' => $params['id']]
            );
            
            // Process file based on type
            $result = $this->processFileContent($upload);
            
            // Update status and results
            $this->db->update('file_uploads', [
                'status' => $result['success'] ? 'completed' : 'failed',
                'processed_records' => $result['processed_records'] ?? 0,
                'failed_records' => $result['failed_records'] ?? 0,
                'error_messages' => $result['errors'] ? json_encode($result['errors']) : null
            ], 'id = :id', ['id' => $params['id']]);
            
            $this->logActivity('process_file', 'file_upload', $params['id'], $result);
            
            Response::success($result, 'File processed successfully');
            
        } catch (Exception $e) {
            // Update status to failed
            $this->db->update('file_uploads', 
                ['status' => 'failed', 'error_messages' => json_encode([$e->getMessage()])],
                'id = :id',
                ['id' => $params['id']]
            );
            
            logError('File processing failed: ' . $e->getMessage());
            Response::error('File processing failed', 500);
        }
    }
    
    private function processFileContent($upload) {
        $result = [
            'success' => false,
            'processed_records' => 0,
            'failed_records' => 0,
            'errors' => [],
            'created_items' => 0,
            'updated_items' => 0
        ];
        
        try {
            if ($upload['file_type'] === 'xlsx' || $upload['file_type'] === 'xls') {
                $result = $this->processExcelFile($upload);
            } elseif ($upload['file_type'] === 'pdf') {
                $result = $this->processPdfFile($upload);
            } else {
                throw new Exception('Unsupported file type');
            }
            
            $result['success'] = true;
            
        } catch (Exception $e) {
            $result['errors'][] = $e->getMessage();
        }
        
        return $result;
    }
    
    private function processExcelFile($upload) {
        // Simplified Excel processing - in a real app you'd use PhpSpreadsheet
        $result = [
            'processed_records' => 0,
            'failed_records' => 0,
            'errors' => [],
            'created_items' => 0,
            'updated_items' => 0
        ];
        
        // Mock processing for demonstration
        $mockData = [
            ['name' => 'Sample Item 1', 'quantity' => 10, 'price' => 99.99, 'company' => 'Acme Corp'],
            ['name' => 'Sample Item 2', 'quantity' => 5, 'price' => 199.99, 'company' => 'TechStart Inc'],
            ['name' => 'Sample Item 3', 'quantity' => 15, 'price' => 49.99, 'company' => 'Acme Corp']
        ];
        
        foreach ($mockData as $row) {
            try {
                // Find or create company
                $company = $this->db->fetch("SELECT id FROM companies WHERE name = :name", ['name' => $row['company']]);
                
                if (!$company) {
                    $result['errors'][] = "Company not found: {$row['company']}";
                    $result['failed_records']++;
                    continue;
                }
                
                // Check if user can access this company
                if (!Auth::canAccessCompany($company['id'])) {
                    $result['errors'][] = "Access denied to company: {$row['company']}";
                    $result['failed_records']++;
                    continue;
                }
                
                // Check if item exists
                $existingItem = $this->db->fetch(
                    "SELECT id FROM inventory_items WHERE name = :name AND company_id = :company_id",
                    ['name' => $row['name'], 'company_id' => $company['id']]
                );
                
                if ($existingItem) {
                    // Update existing item
                    $this->db->update('inventory_items', [
                        'current_quantity' => $row['quantity'],
                        'unit_price' => $row['price'],
                        'updated_by' => $this->user['id']
                    ], 'id = :id', ['id' => $existingItem['id']]);
                    
                    $result['updated_items']++;
                } else {
                    // Create new item
                    $this->db->insert('inventory_items', [
                        'name' => $row['name'],
                        'current_quantity' => $row['quantity'],
                        'min_stock_level' => 1,
                        'unit_price' => $row['price'],
                        'company_id' => $company['id'],
                        'category' => 'Imported',
                        'status' => 'active',
                        'created_by' => $this->user['id'],
                        'updated_by' => $this->user['id']
                    ]);
                    
                    $result['created_items']++;
                }
                
                $result['processed_records']++;
                
            } catch (Exception $e) {
                $result['errors'][] = "Row error: {$e->getMessage()}";
                $result['failed_records']++;
            }
        }
        
        return $result;
    }
    
    private function processPdfFile($upload) {
        // Simplified PDF processing - in a real app you'd use a PDF parser
        $result = [
            'processed_records' => 0,
            'failed_records' => 0,
            'errors' => [],
            'created_items' => 0,
            'updated_items' => 0
        ];
        
        // Mock processing for demonstration
        $result['processed_records'] = 5;
        $result['created_items'] = 3;
        $result['updated_items'] = 2;
        
        return $result;
    }
}
