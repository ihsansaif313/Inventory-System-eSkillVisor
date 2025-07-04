<?php
/**
 * EskillVisor Installation Script
 * Sets up the database and initial configuration
 */

echo "EskillVisor Installation\n";
echo "========================\n\n";

// Check PHP version
if (version_compare(PHP_VERSION, '7.4.0') < 0) {
    echo "✗ PHP 7.4 or higher is required. Current version: " . PHP_VERSION . "\n";
    exit(1);
}
echo "✓ PHP version: " . PHP_VERSION . "\n";

// Check required extensions
$requiredExtensions = ['pdo', 'pdo_mysql', 'json', 'mbstring'];
$missingExtensions = [];

foreach ($requiredExtensions as $ext) {
    if (!extension_loaded($ext)) {
        $missingExtensions[] = $ext;
    }
}

if (!empty($missingExtensions)) {
    echo "✗ Missing required PHP extensions: " . implode(', ', $missingExtensions) . "\n";
    exit(1);
}
echo "✓ All required PHP extensions are loaded\n";

// Include configuration
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

try {
    // Create database instance
    $db = Database::getInstance();
    
    // Create database if it doesn't exist
    echo "\nCreating database...\n";
    if ($db->createDatabase()) {
        echo "✓ Database created or verified successfully\n";
    } else {
        echo "✗ Failed to create database\n";
        exit(1);
    }
    
    // Run migrations
    echo "\nRunning database migrations...\n";
    if ($db->runMigrations()) {
        echo "✓ All migrations executed successfully\n";
    } else {
        echo "✗ Migration failed\n";
        exit(1);
    }
    
    // Verify installation
    echo "\nVerifying installation...\n";
    
    // Check users
    $userCount = $db->fetch("SELECT COUNT(*) as count FROM users");
    echo "✓ Users table: {$userCount['count']} users\n";
    
    // Check companies
    $companyCount = $db->fetch("SELECT COUNT(*) as count FROM companies");
    echo "✓ Companies table: {$companyCount['count']} companies\n";
    
    // Check inventory
    $inventoryCount = $db->fetch("SELECT COUNT(*) as count FROM inventory_items");
    echo "✓ Inventory table: {$inventoryCount['count']} items\n";
    
    echo "\n✓ Installation completed successfully!\n\n";
    
    echo "Next steps:\n";
    echo "1. Configure your web server to point to the backend directory\n";
    echo "2. Ensure the uploads directory is writable: " . UPLOAD_PATH . "\n";
    echo "3. Update the API_BASE_URL in the frontend (src/services/api.js)\n";
    echo "4. Test the API endpoints\n\n";
    
    echo "Default login credentials:\n";
    echo "Super Admin: admin@enterprise.com / password\n";
    echo "Manager: manager@enterprise.com / password\n";
    echo "Partner: partner@enterprise.com / password\n\n";
    
    echo "API Base URL: http://localhost/EskillVisor/backend\n";
    echo "Test endpoint: http://localhost/EskillVisor/backend/api/auth/login\n\n";
    
} catch (Exception $e) {
    echo "✗ Installation failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
