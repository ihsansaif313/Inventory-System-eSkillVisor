-- Create sales_records table
CREATE TABLE IF NOT EXISTS sales_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_item_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    customer VARCHAR(255),
    invoice_number VARCHAR(100),
    sale_date DATE NOT NULL,
    description TEXT,
    uploaded_by INT,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_inventory_item_id (inventory_item_id),
    INDEX idx_sale_date (sale_date),
    INDEX idx_customer (customer),
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_source_file (source_file),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample sales records
INSERT INTO sales_records (inventory_item_id, quantity, unit_price, customer, invoice_number, sale_date, description, uploaded_by, source_file) VALUES 
(4, 5, 110.00, 'Local Business Solutions', 'SAL-2024-001', '2024-01-07', 'Sale to local business client', 3, 'sales_january_2024.xlsx')
ON DUPLICATE KEY UPDATE 
    quantity = VALUES(quantity),
    unit_price = VALUES(unit_price),
    customer = VALUES(customer);
