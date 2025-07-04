-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('info', 'warning', 'error', 'success') NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_read_at (read_at),
    INDEX idx_created_at (created_at),
    INDEX idx_unread (user_id, read_at),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, data) VALUES 
(3, 'warning', 'Low Stock Alert', 'Conference Tables at TechStart Inc is running low (2 remaining, minimum 1)', JSON_OBJECT('inventory_item_id', 5, 'company_id', 2, 'current_quantity', 2, 'min_stock_level', 1)),
(1, 'info', 'Inventory Upload Completed', 'Successfully processed 15 items from purchases_january_2024.xlsx', JSON_OBJECT('file_name', 'purchases_january_2024.xlsx', 'processed_items', 15)),
(1, 'success', 'New Partner Added', 'Alice Partner has been successfully added to the system', JSON_OBJECT('partner_name', 'Alice Partner', 'partner_email', 'alice@partner.com'))
ON DUPLICATE KEY UPDATE 
    message = VALUES(message),
    data = VALUES(data);
