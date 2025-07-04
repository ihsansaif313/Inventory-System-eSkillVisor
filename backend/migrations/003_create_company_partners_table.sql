-- Create company_partners table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS company_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_by INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    
    UNIQUE KEY unique_company_partner (company_id, user_id),
    INDEX idx_company_id (company_id),
    INDEX idx_user_id (user_id),
    INDEX idx_assigned_by (assigned_by),
    INDEX idx_status (status),
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample partner assignments
INSERT INTO company_partners (company_id, user_id, assigned_by, status) VALUES 
(1, 3, 1, 'active'), -- Partner assigned to Acme Corp
(2, 3, 1, 'active')  -- Partner assigned to TechStart Inc
ON DUPLICATE KEY UPDATE 
    status = VALUES(status),
    assigned_by = VALUES(assigned_by);
