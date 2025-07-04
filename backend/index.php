<?php
/**
 * EskillVisor Investment System API
 * Main entry point for the PHP backend
 */

// Enable CORS for frontend communication
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set content type to JSON
header('Content-Type: application/json');

// Error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include autoloader and configuration
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/core/Router.php';
require_once __DIR__ . '/core/Controller.php';
require_once __DIR__ . '/core/Model.php';
require_once __DIR__ . '/core/Auth.php';
require_once __DIR__ . '/core/Response.php';

// Include all controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/CompanyController.php';
require_once __DIR__ . '/controllers/InventoryController.php';
require_once __DIR__ . '/controllers/FileController.php';
require_once __DIR__ . '/controllers/AnalyticsController.php';
require_once __DIR__ . '/controllers/NotificationController.php';

// Include all models
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/Company.php';
require_once __DIR__ . '/models/InventoryItem.php';
require_once __DIR__ . '/models/PurchaseRecord.php';
require_once __DIR__ . '/models/SalesRecord.php';
require_once __DIR__ . '/models/Transaction.php';
require_once __DIR__ . '/models/AuditTrail.php';
require_once __DIR__ . '/models/Notification.php';

// Include services
require_once __DIR__ . '/services/ExcelParser.php';
require_once __DIR__ . '/services/PDFParser.php';
require_once __DIR__ . '/services/CompanyMatcher.php';
require_once __DIR__ . '/services/EmailService.php';

try {
    // Initialize router
    $router = new Router();
    
    // Authentication routes
    $router->post('/api/auth/login', 'AuthController@login');
    $router->post('/api/auth/logout', 'AuthController@logout');
    $router->post('/api/auth/refresh', 'AuthController@refresh');
    $router->post('/api/auth/forgot-password', 'AuthController@forgotPassword');
    $router->post('/api/auth/reset-password', 'AuthController@resetPassword');
    $router->get('/api/auth/me', 'AuthController@me');
    
    // User management routes
    $router->get('/api/users', 'UserController@index');
    $router->get('/api/users/{id}', 'UserController@show');
    $router->post('/api/users', 'UserController@store');
    $router->put('/api/users/{id}', 'UserController@update');
    $router->delete('/api/users/{id}', 'UserController@delete');
    
    // Company management routes
    $router->get('/api/companies', 'CompanyController@index');
    $router->get('/api/companies/{id}', 'CompanyController@show');
    $router->post('/api/companies', 'CompanyController@store');
    $router->put('/api/companies/{id}', 'CompanyController@update');
    $router->delete('/api/companies/{id}', 'CompanyController@delete');
    $router->get('/api/companies/{id}/partners', 'CompanyController@getPartners');
    $router->post('/api/companies/{id}/partners', 'CompanyController@assignPartner');
    $router->delete('/api/companies/{id}/partners/{partnerId}', 'CompanyController@removePartner');
    
    // Inventory management routes
    $router->get('/api/inventory', 'InventoryController@index');
    $router->get('/api/inventory/{id}', 'InventoryController@show');
    $router->post('/api/inventory', 'InventoryController@store');
    $router->put('/api/inventory/{id}', 'InventoryController@update');
    $router->delete('/api/inventory/{id}', 'InventoryController@delete');
    $router->get('/api/inventory/company/{companyId}', 'InventoryController@getByCompany');
    $router->get('/api/inventory/low-stock', 'InventoryController@getLowStock');
    
    // Transaction routes
    $router->get('/api/transactions', 'InventoryController@getTransactions');
    $router->post('/api/transactions', 'InventoryController@createTransaction');
    $router->get('/api/transactions/{id}', 'InventoryController@getTransaction');
    
    // Purchase and Sales records
    $router->get('/api/purchases', 'InventoryController@getPurchases');
    $router->post('/api/purchases', 'InventoryController@createPurchase');
    $router->get('/api/sales', 'InventoryController@getSales');
    $router->post('/api/sales', 'InventoryController@createSale');
    
    // File upload and processing routes
    $router->post('/api/files/upload', 'FileController@upload');
    $router->get('/api/files/uploads', 'FileController@getUploads');
    $router->get('/api/files/uploads/{id}', 'FileController@getUpload');
    $router->post('/api/files/process/{id}', 'FileController@processFile');
    
    // Analytics and reporting routes
    $router->get('/api/analytics/dashboard', 'AnalyticsController@dashboard');
    $router->get('/api/analytics/inventory-stats', 'AnalyticsController@inventoryStats');
    $router->get('/api/analytics/company-stats', 'AnalyticsController@companyStats');
    $router->get('/api/analytics/trends', 'AnalyticsController@trends');
    $router->get('/api/analytics/export', 'AnalyticsController@export');
    
    // Notification routes
    $router->get('/api/notifications', 'NotificationController@index');
    $router->post('/api/notifications', 'NotificationController@store');
    $router->put('/api/notifications/{id}/read', 'NotificationController@markAsRead');
    $router->delete('/api/notifications/{id}', 'NotificationController@delete');
    $router->post('/api/notifications/mark-all-read', 'NotificationController@markAllAsRead');
    
    // Audit trail routes
    $router->get('/api/audit', 'InventoryController@getAuditTrail');
    $router->get('/api/audit/{entityType}/{entityId}', 'InventoryController@getEntityAuditTrail');

    // Test routes
    $router->get('/test', function() {
        Response::success(['message' => 'EskillVisor API is working!', 'timestamp' => date('c')]);
    });

    $router->get('/api/test', function() {
        Response::success(['message' => 'API endpoint is working!', 'timestamp' => date('c')]);
    });

    // Handle the request
    $router->handleRequest();
    
} catch (Exception $e) {
    Response::error('Internal server error: ' . $e->getMessage(), 500);
}
