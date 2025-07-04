<?php
/**
 * Audit Trail Model
 */

class AuditTrail {
    
    public static function log($entityType, $entityId, $action, $oldValues = null, $newValues = null, $performedBy = null) {
        $db = Database::getInstance();
        
        $data = [
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'action' => $action,
            'old_values' => $oldValues ? json_encode($oldValues) : null,
            'new_values' => $newValues ? json_encode($newValues) : null,
            'performed_by' => $performedBy,
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
        ];
        
        $sql = "INSERT INTO audit_trail (
            entity_type, entity_id, action, old_values, new_values,
            performed_by, ip_address, user_agent
        ) VALUES (
            :entity_type, :entity_id, :action, :old_values, :new_values,
            :performed_by, :ip_address, :user_agent
        )";
        
        return $db->insert($sql, $data);
    }
    
    public static function getByEntity($entityType, $entityId) {
        $db = Database::getInstance();
        
        $sql = "SELECT at.*, u.first_name, u.last_name
                FROM audit_trail at
                LEFT JOIN users u ON at.performed_by = u.id
                WHERE at.entity_type = :entity_type AND at.entity_id = :entity_id
                ORDER BY at.performed_at DESC";
        
        return $db->fetchAll($sql, [
            'entity_type' => $entityType,
            'entity_id' => $entityId
        ]);
    }
    
    public static function getAll($filters = []) {
        $db = Database::getInstance();
        
        $where = [];
        $params = [];
        
        if (!empty($filters['entity_type'])) {
            $where[] = "at.entity_type = :entity_type";
            $params['entity_type'] = $filters['entity_type'];
        }
        
        if (!empty($filters['performed_by'])) {
            $where[] = "at.performed_by = :performed_by";
            $params['performed_by'] = $filters['performed_by'];
        }
        
        if (!empty($filters['start_date'])) {
            $where[] = "at.performed_at >= :start_date";
            $params['start_date'] = $filters['start_date'];
        }
        
        if (!empty($filters['end_date'])) {
            $where[] = "at.performed_at <= :end_date";
            $params['end_date'] = $filters['end_date'];
        }
        
        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        
        $sql = "SELECT at.*, u.first_name, u.last_name
                FROM audit_trail at
                LEFT JOIN users u ON at.performed_by = u.id
                {$whereClause}
                ORDER BY at.performed_at DESC
                LIMIT 1000";
        
        return $db->fetchAll($sql, $params);
    }
}
