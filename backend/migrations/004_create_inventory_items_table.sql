-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100),
    category VARCHAR(100) NOT NULL DEFAULT 'Uncategorized',
    current_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    min_stock_level DECIMAL(10,2) NOT NULL DEFAULT 0,
    max_stock_level DECIMAL(10,2),
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_value DECIMAL(10,2) GENERATED ALWAYS AS (current_quantity * unit_price) STORED,
    company_id INT NOT NULL,
    status ENUM('active', 'inactive', 'discontinued') NOT NULL DEFAULT 'active',
    created_by INT,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_sku (sku),
    INDEX idx_category (category),
    INDEX idx_company_id (company_id),
    INDEX idx_status (status),
    INDEX idx_current_quantity (current_quantity),
    INDEX idx_min_stock_level (min_stock_level),
    INDEX idx_created_at (created_at),
    INDEX idx_low_stock (company_id, current_quantity, min_stock_level),
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample inventory items
INSERT INTO inventory_items (name, description, sku, category, current_quantity, min_stock_level, max_stock_level, unit_price, company_id, created_by) VALUES 
('Office Chairs', 'Ergonomic office chairs with lumbar support', 'OFC-001', 'Office Furniture', 25, 10, 50, 299.99, 1, 1),
('Laptops', 'Dell Latitude 5520 Business Laptops', 'LAP-002', 'Electronics', 8, 5, 20, 1299.99, 1, 1),
('Printer Paper', 'A4 white printer paper, 500 sheets per pack', 'PPR-007', 'Office Supplies', 45, 20, 100, 8.99, 1, 1),
('Wireless Keyboards', 'Logitech MX Keys Wireless Keyboards', 'KEY-003', 'Electronics', 15, 8, 30, 99.99, 2, 1),
('Conference Tables', 'Large conference tables for meeting rooms', 'TBL-008', 'Office Furniture', 2, 1, 5, 899.99, 2, 1)
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    current_quantity = VALUES(current_quantity),
    unit_price = VALUES(unit_price);
