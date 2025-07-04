<?php
/**
 * Application Configuration Example
 * Copy this file to config.php and update with your settings
 */

// Application settings
define('APP_NAME', 'EskillVisor Investment System');
define('APP_VERSION', '1.0.0');
define('APP_ENV', 'development'); // development, production
define('APP_DEBUG', true);

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'eskillvisor_db');
define('DB_USER', 'root');
define('DB_PASS', ''); // Update with your database password
define('DB_CHARSET', 'utf8mb4');

// JWT Configuration
define('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION', 3600 * 24); // 24 hours
define('JWT_REFRESH_EXPIRATION', 3600 * 24 * 7); // 7 days

// File upload settings
define('UPLOAD_MAX_SIZE', 10 * 1024 * 1024); // 10MB
define('UPLOAD_ALLOWED_TYPES', ['xlsx', 'xls', 'pdf']);
define('UPLOAD_PATH', __DIR__ . '/../uploads/');

// Email configuration (for password reset)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SMTP_FROM_EMAIL', 'noreply@eskillvisor.com');
define('SMTP_FROM_NAME', 'EskillVisor System');

// API Configuration
define('API_RATE_LIMIT', 100); // requests per minute
define('API_TIMEOUT', 30); // seconds

// Security settings
define('BCRYPT_COST', 12);
define('SESSION_LIFETIME', 3600); // 1 hour
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_LOCKOUT_TIME', 900); // 15 minutes

// Logging
define('LOG_LEVEL', 'INFO'); // DEBUG, INFO, WARNING, ERROR
define('LOG_MAX_FILES', 30); // Keep logs for 30 days

// Pagination
define('DEFAULT_PAGE_SIZE', 20);
define('MAX_PAGE_SIZE', 100);

// Notification settings
define('LOW_STOCK_THRESHOLD', 10);
define('NOTIFICATION_RETENTION_DAYS', 30);

// File processing
define('EXCEL_MAX_ROWS', 10000);
define('PDF_MAX_SIZE', 5 * 1024 * 1024); // 5MB

// Cache settings
define('CACHE_ENABLED', true);
define('CACHE_TTL', 3600); // 1 hour

// CORS settings
define('CORS_ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://yourdomain.com'
]);

// Error reporting
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('UTC');

// Include helper functions
require_once __DIR__ . '/../core/helpers.php';
?>
