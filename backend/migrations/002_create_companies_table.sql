-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample companies
INSERT INTO companies (name, description, industry, status) VALUES 
('Acme Corp', 'Leading technology solutions provider', 'Technology', 'active'),
('TechStart Inc', 'Innovative startup in the tech space', 'Technology', 'active'),
('Global Ventures', 'International investment firm', 'Finance', 'active'),
('Future Fund', 'Venture capital and investment', 'Finance', 'active'),
('Capital Partners', 'Strategic investment partners', 'Finance', 'active')
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    industry = VALUES(industry),
    status = VALUES(status);
