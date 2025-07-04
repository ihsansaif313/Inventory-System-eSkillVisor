-- Create purchase_records table
CREATE TABLE IF NOT EXISTS purchase_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_item_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    supplier VARCHAR(255),
    invoice_number VARCHAR(100),
    purchase_date DATE NOT NULL,
    description TEXT,
    uploaded_by INT,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_inventory_item_id (inventory_item_id),
    INDEX idx_purchase_date (purchase_date),
    INDEX idx_supplier (supplier),
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_source_file (source_file),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample purchase records
INSERT INTO purchase_records (inventory_item_id, quantity, unit_price, supplier, invoice_number, purchase_date, description, uploaded_by, source_file) VALUES 
(1, 10, 280.00, 'Office Furniture Plus', 'INV-2024-001', '2024-01-05', 'Bulk purchase of ergonomic office chairs', 1, 'purchases_january_2024.xlsx'),
(2, 5, 1250.00, 'Dell Business Direct', 'DELL-2024-0103', '2024-01-03', 'New laptops for development team', 1, 'tech_purchases_q1_2024.xlsx')
ON DUPLICATE KEY UPDATE 
    quantity = VALUES(quantity),
    unit_price = VALUES(unit_price),
    supplier = VALUES(supplier);
