<?php
/**
 * PDF Parser Service
 * Handles PDF file parsing for inventory data
 */

class PDFParser {
    
    public static function parseFile($filePath) {
        // Simplified PDF parsing - in production use a proper PDF library
        $result = [
            'success' => true,
            'data' => [],
            'errors' => []
        ];
        
        // Mock data for demonstration - in real implementation, parse PDF content
        $mockData = [
            ['name' => 'Desk Lamps', 'quantity' => 12, 'price' => 45.99, 'company' => 'Office Solutions'],
            ['name' => 'Filing Cabinets', 'quantity' => 6, 'price' => 199.99, 'company' => 'Office Solutions'],
            ['name' => 'Ergonomic Mice', 'quantity' => 20, 'price' => 29.99, 'company' => 'Tech Supplies'],
            ['name' => 'Monitor Stands', 'quantity' => 10, 'price' => 79.99, 'company' => 'Tech Supplies']
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
