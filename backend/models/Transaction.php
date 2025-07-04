<?php
/**
 * Transaction Model
 */

class Transaction {
    
    public static function create($data) {
        $db = Database::getInstance();
        
        $sql = "INSERT INTO transactions (
            inventory_item_id, type, quantity, unit_price, transaction_date,
            description, reference_number, performed_by, company_id, status
        ) VALUES (
            :inventory_item_id, :type, :quantity, :unit_price, :transaction_date,
            :description, :reference_number, :performed_by, :company_id, :status
        )";
        
        return $db->insert($sql, $data);
    }
    
    public static function getByItem($itemId) {
        $db = Database::getInstance();
        
        $sql = "SELECT t.*, u.first_name, u.last_name
                FROM transactions t
                LEFT JOIN users u ON t.performed_by = u.id
                WHERE t.inventory_item_id = :item_id
                ORDER BY t.transaction_date DESC";
        
        return $db->fetchAll($sql, ['item_id' => $itemId]);
    }
    
    public static function getByCompany($companyId) {
        $db = Database::getInstance();
        
        $sql = "SELECT t.*, ii.name as item_name, u.first_name, u.last_name
                FROM transactions t
                LEFT JOIN inventory_items ii ON t.inventory_item_id = ii.id
                LEFT JOIN users u ON t.performed_by = u.id
                WHERE t.company_id = :company_id
                ORDER BY t.transaction_date DESC";
        
        return $db->fetchAll($sql, ['company_id' => $companyId]);
    }
    
    public static function getAll($filters = []) {
        $db = Database::getInstance();
        
        $where = [];
        $params = [];
        
        if (!empty($filters['company_id'])) {
            $where[] = "t.company_id = :company_id";
            $params['company_id'] = $filters['company_id'];
        }
        
        if (!empty($filters['type'])) {
            $where[] = "t.type = :type";
            $params['type'] = $filters['type'];
        }
        
        if (!empty($filters['start_date'])) {
            $where[] = "t.transaction_date >= :start_date";
            $params['start_date'] = $filters['start_date'];
        }
        
        if (!empty($filters['end_date'])) {
            $where[] = "t.transaction_date <= :end_date";
            $params['end_date'] = $filters['end_date'];
        }
        
        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        
        $sql = "SELECT t.*, ii.name as item_name, c.name as company_name, u.first_name, u.last_name
                FROM transactions t
                LEFT JOIN inventory_items ii ON t.inventory_item_id = ii.id
                LEFT JOIN companies c ON t.company_id = c.id
                LEFT JOIN users u ON t.performed_by = u.id
                {$whereClause}
                ORDER BY t.transaction_date DESC";
        
        return $db->fetchAll($sql, $params);
    }
}
