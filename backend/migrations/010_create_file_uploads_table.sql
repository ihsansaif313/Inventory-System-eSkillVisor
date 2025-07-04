-- Create file_uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100),
    status ENUM('uploaded', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'uploaded',
    processed_records INT DEFAULT 0,
    failed_records INT DEFAULT 0,
    error_messages JSON,
    company_matches JSON,
    uploaded_by INT,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_original_name (original_name),
    INDEX idx_file_type (file_type),
    INDEX idx_status (status),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample file upload records
INSERT INTO file_uploads (original_name, stored_name, file_path, file_type, file_size, mime_type, status, processed_records, failed_records, uploaded_by, processed_at) VALUES 
('purchases_january_2024.xlsx', 'upload_1704447000_purchases.xlsx', '/uploads/upload_1704447000_purchases.xlsx', 'xlsx', 45678, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'completed', 15, 2, 1, '2024-01-05 10:30:00'),
('proforma_techstart_2024.pdf', 'upload_1704533700_proforma.pdf', '/uploads/upload_1704533700_proforma.pdf', 'pdf', 234567, 'application/pdf', 'completed', 8, 0, 3, '2024-01-07 09:15:00')
ON DUPLICATE KEY UPDATE 
    status = VALUES(status),
    processed_records = VALUES(processed_records),
    failed_records = VALUES(failed_records);
