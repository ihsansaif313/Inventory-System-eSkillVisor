<?php
/**
 * Sales Record Model
 */

class SalesRecord {
    
    public static function create($data) {
        $db = Database::getInstance();
        
        $sql = "INSERT INTO sales_records (
            inventory_item_id, customer, quantity, unit_price, total_amount,
            sale_date, invoice_number, company_id, created_by
        ) VALUES (
            :inventory_item_id, :customer, :quantity, :unit_price, :total_amount,
            :sale_date, :invoice_number, :company_id, :created_by
        )";
        
        return $db->insert($sql, $data);
    }
    
    public static function getByCompany($companyId) {
        $db = Database::getInstance();
        
        $sql = "SELECT sr.*, ii.name as item_name, u.first_name, u.last_name
                FROM sales_records sr
                LEFT JOIN inventory_items ii ON sr.inventory_item_id = ii.id
                LEFT JOIN users u ON sr.created_by = u.id
                WHERE sr.company_id = :company_id
                ORDER BY sr.sale_date DESC";
        
        return $db->fetchAll($sql, ['company_id' => $companyId]);
    }
    
    public static function getAll($filters = []) {
        $db = Database::getInstance();
        
        $where = [];
        $params = [];
        
        if (!empty($filters['company_id'])) {
            $where[] = "sr.company_id = :company_id";
            $params['company_id'] = $filters['company_id'];
        }
        
        if (!empty($filters['start_date'])) {
            $where[] = "sr.sale_date >= :start_date";
            $params['start_date'] = $filters['start_date'];
        }
        
        if (!empty($filters['end_date'])) {
            $where[] = "sr.sale_date <= :end_date";
            $params['end_date'] = $filters['end_date'];
        }
        
        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        
        $sql = "SELECT sr.*, ii.name as item_name, c.name as company_name, u.first_name, u.last_name
                FROM sales_records sr
                LEFT JOIN inventory_items ii ON sr.inventory_item_id = ii.id
                LEFT JOIN companies c ON sr.company_id = c.id
                LEFT JOIN users u ON sr.created_by = u.id
                {$whereClause}
                ORDER BY sr.sale_date DESC";
        
        return $db->fetchAll($sql, $params);
    }
}
