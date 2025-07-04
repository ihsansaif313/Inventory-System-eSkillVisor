# EskillVisor API Documentation

## Base URL
```
http://localhost/EskillVisor/backend
```

## Authentication

All API endpoints (except login) require JWT authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### POST /api/auth/login
Login user and get access token.

**Request Body:**
```json
{
  "email": "admin@enterprise.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@enterprise.com",
      "role": "superadmin"
    },
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "expires_in": 86400
  }
}
```

#### POST /api/auth/logout
Logout current user.

**Headers:** Authorization: Bearer <token>

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### POST /api/auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "new_jwt_token",
    "expires_in": 86400
  }
}
```

#### GET /api/auth/me
Get current user information.

**Headers:** Authorization: Bearer <token>

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@enterprise.com",
    "role": "superadmin",
    "assigned_companies": []
  }
}
```

#### POST /api/auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /api/auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "new_password",
  "password_confirmation": "new_password"
}
```

## User Management (Manager+ only)

#### GET /api/users
Get list of users with pagination.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 20, max: 100)
- `search` (string): Search by name or email
- `role` (string): Filter by role (superadmin, manager, partner)
- `status` (string): Filter by status (active, inactive, suspended)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@enterprise.com",
      "role": "superadmin",
      "status": "active",
      "last_login": "2024-01-07 10:30:00",
      "created_at": "2024-01-01 00:00:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 3,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

#### GET /api/users/{id}
Get specific user by ID.

#### POST /api/users
Create new user.

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "partner",
  "status": "active"
}
```

#### PUT /api/users/{id}
Update user.

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "manager",
  "status": "active"
}
```

#### DELETE /api/users/{id}
Delete user (SuperAdmin only).

## Company Management

#### GET /api/companies
Get list of companies.

**Query Parameters:**
- `page`, `limit`, `search`, `status` (same as users)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Acme Corp",
      "description": "Leading technology solutions provider",
      "industry": "Technology",
      "email": "contact@acme.com",
      "phone": "+1-555-0123",
      "status": "active",
      "inventory_count": 25,
      "total_value": 45678.90,
      "partner_count": 2,
      "created_at": "2024-01-01 00:00:00"
    }
  ],
  "pagination": {...}
}
```

#### GET /api/companies/{id}
Get specific company with detailed stats.

#### POST /api/companies
Create new company (Manager+ only).

**Request Body:**
```json
{
  "name": "New Company",
  "description": "Company description",
  "industry": "Technology",
  "email": "contact@company.com",
  "phone": "+1-555-0123",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postal_code": "10001"
}
```

#### PUT /api/companies/{id}
Update company (Manager+ only).

#### DELETE /api/companies/{id}
Delete company (SuperAdmin only).

#### GET /api/companies/{id}/partners
Get partners assigned to company.

#### POST /api/companies/{id}/partners
Assign partner to company.

**Request Body:**
```json
{
  "user_id": 3
}
```

#### DELETE /api/companies/{id}/partners/{partnerId}
Remove partner from company.

## Inventory Management

#### GET /api/inventory
Get inventory items.

**Query Parameters:**
- `page`, `limit`, `search` (standard pagination)
- `company_id` (int): Filter by company
- `category` (string): Filter by category
- `status` (string): Filter by status
- `low_stock` (boolean): Show only low stock items

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Office Chairs",
      "description": "Ergonomic office chairs",
      "sku": "OFC-001",
      "category": "Office Furniture",
      "current_quantity": 25,
      "min_stock_level": 10,
      "max_stock_level": 50,
      "unit_price": 299.99,
      "total_value": 7499.75,
      "company_id": 1,
      "company_name": "Acme Corp",
      "status": "active",
      "created_by_name": "Super Admin",
      "created_at": "2024-01-01 00:00:00",
      "updated_at": "2024-01-07 10:30:00"
    }
  ],
  "pagination": {...}
}
```

#### GET /api/inventory/{id}
Get specific inventory item.

#### POST /api/inventory
Create inventory item.

**Request Body:**
```json
{
  "name": "New Item",
  "description": "Item description",
  "sku": "ITM-001",
  "category": "Electronics",
  "current_quantity": 100,
  "min_stock_level": 20,
  "max_stock_level": 200,
  "unit_price": 99.99,
  "company_id": 1
}
```

#### PUT /api/inventory/{id}
Update inventory item.

#### DELETE /api/inventory/{id}
Delete inventory item (Manager+ only).

#### GET /api/inventory/low-stock
Get items with low stock levels.

#### GET /api/inventory/company/{companyId}
Get inventory items for specific company.

## Transactions

#### GET /api/transactions
Get inventory transactions.

**Query Parameters:**
- Standard pagination parameters
- `inventory_item_id` (int): Filter by item
- `type` (string): Filter by type (purchase, sale, adjustment, transfer)
- `date_from`, `date_to` (date): Date range filter

#### POST /api/transactions
Create new transaction.

**Request Body:**
```json
{
  "inventory_item_id": 1,
  "type": "purchase",
  "quantity": 10,
  "unit_price": 299.99,
  "description": "Bulk purchase",
  "reference_id": "PO-2024-001"
}
```

#### GET /api/purchases
Get purchase records.

#### POST /api/purchases
Create purchase record.

#### GET /api/sales
Get sales records.

#### POST /api/sales
Create sales record.

## File Processing

#### POST /api/files/upload
Upload file for processing.

**Request:** Multipart form data with file field

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "original_name": "inventory.xlsx",
    "file_type": "xlsx",
    "file_size": 45678,
    "status": "uploaded"
  }
}
```

#### GET /api/files/uploads
Get list of uploaded files.

**Query Parameters:**
- Standard pagination parameters

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "original_name": "inventory.xlsx",
      "file_type": "xlsx",
      "file_size": 45678,
      "status": "completed",
      "processed_records": 15,
      "failed_records": 2,
      "uploaded_by_name": "Manager User",
      "created_at": "2024-01-07 09:00:00",
      "processed_at": "2024-01-07 09:05:00"
    }
  ],
  "pagination": {...}
}
```

#### GET /api/files/uploads/{id}
Get specific upload details.

#### POST /api/files/process/{id}
Process uploaded file.

**Response:**
```json
{
  "success": true,
  "data": {
    "processed_records": 15,
    "failed_records": 2,
    "created_items": 10,
    "updated_items": 5,
    "errors": [
      "Row 3: Company not found: Unknown Corp",
      "Row 7: Invalid quantity value"
    ]
  }
}
```

## Analytics and Reporting

#### GET /api/analytics/dashboard
Get dashboard analytics data.

**Response:**
```json
{
  "success": true,
  "data": {
    "inventory": {
      "total_items": 150,
      "total_value": 125000.50,
      "low_stock_count": 5,
      "companies_count": 5,
      "avg_unit_price": 833.34
    },
    "top_categories": [
      {
        "category": "Electronics",
        "count": 45,
        "value": 67500.00
      }
    ],
    "users": {
      "total_users": 8,
      "superadmins": 1,
      "managers": 2,
      "partners": 5,
      "active_users": 7,
      "recent_logins": 5
    },
    "companies": {
      "total_companies": 5,
      "active_companies": 5,
      "total_partners": 5,
      "total_inventory_items": 150,
      "total_inventory_value": 125000.50
    },
    "recent_activity": [
      {
        "action": "create",
        "entity_type": "inventory_item",
        "entity_id": 25,
        "user_name": "Manager User",
        "created_at": "2024-01-07 10:30:00"
      }
    ]
  }
}
```

#### GET /api/analytics/inventory-stats
Get detailed inventory statistics.

#### GET /api/analytics/company-stats
Get company statistics (Manager+ only).

#### GET /api/analytics/trends
Get inventory trends over time.

#### GET /api/analytics/export
Export data to CSV/Excel.

**Query Parameters:**
- `type` (string): Data type to export (inventory, companies)
- `format` (string): Export format (csv, json)

## Notifications

#### GET /api/notifications
Get user notifications.

**Query Parameters:**
- Standard pagination parameters
- `unread_only` (boolean): Show only unread notifications

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "warning",
      "title": "Low Stock Alert",
      "message": "Office Chairs at Acme Corp is running low",
      "data": {
        "inventory_item_id": 1,
        "company_id": 1,
        "current_quantity": 8,
        "min_stock_level": 10
      },
      "read_at": null,
      "created_at": "2024-01-07 10:00:00"
    }
  ],
  "pagination": {...},
  "unread_count": 3
}
```

#### POST /api/notifications
Create notification (Manager+ only).

**Request Body:**
```json
{
  "user_id": 3,
  "type": "info",
  "title": "System Update",
  "message": "System will be updated tonight",
  "data": {}
}
```

#### PUT /api/notifications/{id}/read
Mark notification as read.

#### POST /api/notifications/mark-all-read
Mark all notifications as read.

#### DELETE /api/notifications/{id}
Delete notification.

## Audit Trail

#### GET /api/audit
Get audit trail records.

**Query Parameters:**
- Standard pagination parameters
- `action` (string): Filter by action type
- `entity_type` (string): Filter by entity type
- `entity_id` (int): Filter by entity ID
- `user_id` (int): Filter by user

#### GET /api/audit/{entityType}/{entityId}
Get audit trail for specific entity.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2024-01-07T10:30:00Z",
  "data": {
    "errors": {
      "field_name": ["Validation error message"]
    }
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per hour per user.

## Pagination

All list endpoints support pagination with these parameters:
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 20, max: 100)

Pagination response format:
```json
{
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false,
    "next_page": 2,
    "prev_page": null
  }
}
```
