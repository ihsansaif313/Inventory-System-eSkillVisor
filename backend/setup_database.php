<?php
/**
 * Database Setup Script
 * Run this script to create the database and run all migrations
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

echo "EskillVisor Database Setup\n";
echo "==========================\n\n";

try {
    // Create database instance
    $db = Database::getInstance();
    
    // Create database if it doesn't exist
    echo "Creating database if it doesn't exist...\n";
    if ($db->createDatabase()) {
        echo "✓ Database created or verified successfully\n\n";
    } else {
        echo "✗ Failed to create database\n";
        exit(1);
    }
    
    // Run migrations
    echo "Running database migrations...\n";
    if ($db->runMigrations()) {
        echo "✓ All migrations executed successfully\n\n";
    } else {
        echo "✗ Migration failed\n";
        exit(1);
    }
    
    // Verify tables were created
    echo "Verifying database structure...\n";
    $tables = [
        'users',
        'companies', 
        'company_partners',
        'inventory_items',
        'inventory_transactions',
        'purchase_records',
        'sales_records',
        'audit_trail',
        'notifications',
        'file_uploads',
        'user_tokens',
        'migrations'
    ];
    
    $allTablesExist = true;
    foreach ($tables as $table) {
        if ($db->tableExists($table)) {
            echo "✓ Table '{$table}' exists\n";
        } else {
            echo "✗ Table '{$table}' missing\n";
            $allTablesExist = false;
        }
    }
    
    if ($allTablesExist) {
        echo "\n✓ Database setup completed successfully!\n";
        echo "\nDefault login credentials:\n";
        echo "Super Admin: admin@enterprise.com / password\n";
        echo "Manager: manager@enterprise.com / password\n";
        echo "Partner: partner@enterprise.com / password\n";
        echo "\nNote: Please change these passwords in production!\n";
    } else {
        echo "\n✗ Database setup incomplete - some tables are missing\n";
        exit(1);
    }
    
} catch (Exception $e) {
    echo "✗ Database setup failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
