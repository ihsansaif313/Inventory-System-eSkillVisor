<?php
/**
 * Notification Controller
 */

class NotificationController extends Controller {
    
    public function index() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $pagination = $this->getPaginationParams();
            $unreadOnly = $this->getQueryParam('unread_only') === 'true';
            
            $where = "user_id = :user_id";
            $params = ['user_id' => $this->user['id']];
            
            if ($unreadOnly) {
                $where .= " AND read_at IS NULL";
            }
            
            $sql = "SELECT * FROM notifications 
                    WHERE {$where}
                    ORDER BY created_at DESC
                    LIMIT {$pagination['limit']} OFFSET {$pagination['offset']}";
            
            $countSql = "SELECT COUNT(*) as total FROM notifications WHERE {$where}";
            
            $notifications = $this->db->fetchAll($sql, $params);
            $totalResult = $this->db->fetch($countSql, $params);
            $total = $totalResult['total'];
            
            // Get unread count
            $unreadResult = $this->db->fetch(
                "SELECT COUNT(*) as count FROM notifications WHERE user_id = :user_id AND read_at IS NULL",
                ['user_id' => $this->user['id']]
            );
            
            $response = $this->buildPaginatedResponse($notifications, $total, $pagination['page'], $pagination['limit']);
            $response['unread_count'] = $unreadResult['count'];
            
            Response::success($response);
        } catch (Exception $e) {
            logError('Get notifications failed: ' . $e->getMessage());
            Response::error('Failed to get notifications', 500);
        }
    }
    
    public function store() {
        if (!$this->requireManager()) {
            return;
        }
        
        $data = $this->getRequestData();
        
        $rules = [
            'user_id' => 'integer',
            'type' => 'required|in:info,warning,error,success',
            'title' => 'required|max:255',
            'message' => 'required|max:1000',
            'data' => 'json'
        ];
        
        if (!$this->validateAndRespond($data, $rules)) {
            return;
        }
        
        try {
            // If no user_id specified, send to all users (broadcast)
            if (!isset($data['user_id'])) {
                $this->broadcastNotification($data);
            } else {
                $this->createNotification($data);
            }
            
            Response::created(null, 'Notification sent successfully');
        } catch (Exception $e) {
            logError('Create notification failed: ' . $e->getMessage());
            Response::error('Failed to create notification', 500);
        }
    }
    
    public function markAsRead($params) {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $affected = $this->db->update(
                'notifications',
                ['read_at' => date('Y-m-d H:i:s')],
                'id = :id AND user_id = :user_id AND read_at IS NULL',
                ['id' => $params['id'], 'user_id' => $this->user['id']]
            );
            
            if ($affected > 0) {
                Response::success(null, 'Notification marked as read');
            } else {
                Response::notFound('Notification not found or already read');
            }
        } catch (Exception $e) {
            logError('Mark notification as read failed: ' . $e->getMessage());
            Response::error('Failed to mark notification as read', 500);
        }
    }
    
    public function markAllAsRead() {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $affected = $this->db->update(
                'notifications',
                ['read_at' => date('Y-m-d H:i:s')],
                'user_id = :user_id AND read_at IS NULL',
                ['user_id' => $this->user['id']]
            );
            
            Response::success(['marked_count' => $affected], 'All notifications marked as read');
        } catch (Exception $e) {
            logError('Mark all notifications as read failed: ' . $e->getMessage());
            Response::error('Failed to mark all notifications as read', 500);
        }
    }
    
    public function delete($params) {
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $affected = $this->db->delete(
                'notifications',
                'id = :id AND user_id = :user_id',
                ['id' => $params['id'], 'user_id' => $this->user['id']]
            );
            
            if ($affected > 0) {
                Response::deleted('Notification deleted successfully');
            } else {
                Response::notFound('Notification not found');
            }
        } catch (Exception $e) {
            logError('Delete notification failed: ' . $e->getMessage());
            Response::error('Failed to delete notification', 500);
        }
    }
    
    private function createNotification($data) {
        $notificationData = [
            'user_id' => $data['user_id'],
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
            'data' => isset($data['data']) ? json_encode($data['data']) : null,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        return $this->db->insert('notifications', $notificationData);
    }
    
    private function broadcastNotification($data) {
        // Get all active users
        $users = $this->db->fetchAll("SELECT id FROM users WHERE status = 'active'");
        
        foreach ($users as $user) {
            $notificationData = [
                'user_id' => $user['id'],
                'type' => $data['type'],
                'title' => $data['title'],
                'message' => $data['message'],
                'data' => isset($data['data']) ? json_encode($data['data']) : null,
                'created_at' => date('Y-m-d H:i:s')
            ];
            
            $this->db->insert('notifications', $notificationData);
        }
    }
    
    public static function createLowStockNotification($inventoryItem, $company) {
        try {
            $db = Database::getInstance();
            
            // Get partners assigned to this company
            $partners = $db->fetchAll(
                "SELECT DISTINCT u.id FROM users u 
                 JOIN company_partners cp ON u.id = cp.user_id 
                 WHERE cp.company_id = :company_id AND cp.status = 'active'",
                ['company_id' => $company['id']]
            );
            
            // Also notify managers and superadmins
            $managers = $db->fetchAll(
                "SELECT id FROM users WHERE role IN ('manager', 'superadmin') AND status = 'active'"
            );
            
            $allUsers = array_merge($partners, $managers);
            
            foreach ($allUsers as $user) {
                $notificationData = [
                    'user_id' => $user['id'],
                    'type' => 'warning',
                    'title' => 'Low Stock Alert',
                    'message' => "{$inventoryItem['name']} at {$company['name']} is running low ({$inventoryItem['current_quantity']} remaining, minimum {$inventoryItem['min_stock_level']})",
                    'data' => json_encode([
                        'inventory_item_id' => $inventoryItem['id'],
                        'company_id' => $company['id'],
                        'current_quantity' => $inventoryItem['current_quantity'],
                        'min_stock_level' => $inventoryItem['min_stock_level']
                    ]),
                    'created_at' => date('Y-m-d H:i:s')
                ];
                
                $db->insert('notifications', $notificationData);
            }
        } catch (Exception $e) {
            logError('Create low stock notification failed: ' . $e->getMessage());
        }
    }
}
