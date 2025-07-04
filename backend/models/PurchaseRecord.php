<?php
/**
 * Purchase Record Model
 */

class PurchaseRecord {
    
    public static function create($data) {
        $db = Database::getInstance();
        
        $sql = "INSERT INTO purchase_records (
            inventory_item_id, supplier, quantity, unit_price, total_amount,
            purchase_date, invoice_number, company_id, created_by
        ) VALUES (
            :inventory_item_id, :supplier, :quantity, :unit_price, :total_amount,
            :purchase_date, :invoice_number, :company_id, :created_by
        )";
        
        return $db->insert($sql, $data);
    }
    
    public static function getByCompany($companyId) {
        $db = Database::getInstance();
        
        $sql = "SELECT pr.*, ii.name as item_name, u.first_name, u.last_name
                FROM purchase_records pr
                LEFT JOIN inventory_items ii ON pr.inventory_item_id = ii.id
                LEFT JOIN users u ON pr.created_by = u.id
                WHERE pr.company_id = :company_id
                ORDER BY pr.purchase_date DESC";
        
        return $db->fetchAll($sql, ['company_id' => $companyId]);
    }
    
    public static function getAll($filters = []) {
        $db = Database::getInstance();
        
        $where = [];
        $params = [];
        
        if (!empty($filters['company_id'])) {
            $where[] = "pr.company_id = :company_id";
            $params['company_id'] = $filters['company_id'];
        }
        
        if (!empty($filters['start_date'])) {
            $where[] = "pr.purchase_date >= :start_date";
            $params['start_date'] = $filters['start_date'];
        }
        
        if (!empty($filters['end_date'])) {
            $where[] = "pr.purchase_date <= :end_date";
            $params['end_date'] = $filters['end_date'];
        }
        
        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        
        $sql = "SELECT pr.*, ii.name as item_name, c.name as company_name, u.first_name, u.last_name
                FROM purchase_records pr
                LEFT JOIN inventory_items ii ON pr.inventory_item_id = ii.id
                LEFT JOIN companies c ON pr.company_id = c.id
                LEFT JOIN users u ON pr.created_by = u.id
                {$whereClause}
                ORDER BY pr.purchase_date DESC";
        
        return $db->fetchAll($sql, $params);
    }
}
