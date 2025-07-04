<?php
/**
 * Excel Parser Service
 * Handles Excel file parsing for inventory data
 */

class ExcelParser {
    
    public static function parseFile($filePath) {
        // Simplified Excel parsing - in production use PhpSpreadsheet
        $result = [
            'success' => true,
            'data' => [],
            'errors' => []
        ];
        
        // Mock data for demonstration
        $mockData = [
            ['name' => 'Office Chairs', 'quantity' => 25, 'price' => 299.99, 'company' => 'Acme Corp'],
            ['name' => 'Laptops', 'quantity' => 8, 'price' => 1299.99, 'company' => 'Acme Corp'],
            ['name' => 'Printer Paper', 'quantity' => 45, 'price' => 8.99, 'company' => 'Acme Corp'],
            ['name' => 'Wireless Keyboards', 'quantity' => 15, 'price' => 99.99, 'company' => 'TechStart Inc'],
            ['name' => 'Conference Tables', 'quantity' => 2, 'price' => 899.99, 'company' => 'TechStart Inc']
        ];
        
        $result['data'] = $mockData;
        
        return $result;
    }
    
    public static function validateData($data) {
        $errors = [];
        
        foreach ($data as $index => $row) {
            if (empty($row['name'])) {
                $errors[] = "Row " . ($index + 1) . ": Name is required";
            }
            
            if (!is_numeric($row['quantity']) || $row['quantity'] < 0) {
                $errors[] = "Row " . ($index + 1) . ": Invalid quantity";
            }
            
            if (!is_numeric($row['price']) || $row['price'] < 0) {
                $errors[] = "Row " . ($index + 1) . ": Invalid price";
            }
            
            if (empty($row['company'])) {
                $errors[] = "Row " . ($index + 1) . ": Company is required";
            }
        }
        
        return $errors;
    }
}
