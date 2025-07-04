# EskillVisor Database Schema

## Overview

The EskillVisor system uses MySQL 8.0+ with the following database structure:

**Database Name:** `eskillvisor_db`
**Character Set:** `utf8mb4`
**Collation:** `utf8mb4_unicode_ci`

## Tables

### users
User accounts and authentication information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User's email address |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM('superadmin', 'manager', 'partner') | NOT NULL, DEFAULT 'partner' | User role |
| status | ENUM('active', 'inactive', 'suspended') | NOT NULL, DEFAULT 'active' | Account status |
| email_verified_at | TIMESTAMP | NULL | Email verification timestamp |
| last_login | TIMESTAMP | NULL | Last login timestamp |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_email` (email)
- `idx_role` (role)
- `idx_status` (status)
- `idx_created_at` (created_at)

### companies
Company information and details.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique company identifier |
| name | VARCHAR(255) | NOT NULL | Company name |
| description | TEXT | NULL | Company description |
| industry | VARCHAR(100) | NULL | Industry sector |
| website | VARCHAR(255) | NULL | Company website |
| email | VARCHAR(255) | NULL | Contact email |
| phone | VARCHAR(50) | NULL | Contact phone |
| address | TEXT | NULL | Physical address |
| city | VARCHAR(100) | NULL | City |
| state | VARCHAR(100) | NULL | State/Province |
| country | VARCHAR(100) | NULL | Country |
| postal_code | VARCHAR(20) | NULL | Postal/ZIP code |
| status | ENUM('active', 'inactive') | NOT NULL, DEFAULT 'active' | Company status |
| created_by | INT | FOREIGN KEY → users(id) | User who created record |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_name` (name)
- `idx_status` (status)
- `idx_created_by` (created_by)
- `idx_created_at` (created_at)

### company_partners
Many-to-many relationship between companies and partner users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique assignment identifier |
| company_id | INT | NOT NULL, FOREIGN KEY → companies(id) | Company reference |
| user_id | INT | NOT NULL, FOREIGN KEY → users(id) | Partner user reference |
| assigned_by | INT | FOREIGN KEY → users(id) | User who made assignment |
| assigned_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Assignment timestamp |
| status | ENUM('active', 'inactive') | NOT NULL, DEFAULT 'active' | Assignment status |

**Indexes:**
- `unique_company_partner` (company_id, user_id) - UNIQUE
- `idx_company_id` (company_id)
- `idx_user_id` (user_id)
- `idx_assigned_by` (assigned_by)
- `idx_status` (status)

### inventory_items
Inventory item master data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique item identifier |
| name | VARCHAR(255) | NOT NULL | Item name |
| description | TEXT | NULL | Item description |
| sku | VARCHAR(100) | NULL | Stock Keeping Unit |
| category | VARCHAR(100) | NOT NULL, DEFAULT 'Uncategorized' | Item category |
| current_quantity | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | Current stock quantity |
| min_stock_level | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | Minimum stock threshold |
| max_stock_level | DECIMAL(10,2) | NULL | Maximum stock level |
| unit_price | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | Price per unit |
| total_value | DECIMAL(10,2) | GENERATED ALWAYS AS (current_quantity * unit_price) STORED | Calculated total value |
| company_id | INT | NOT NULL, FOREIGN KEY → companies(id) | Owning company |
| status | ENUM('active', 'inactive', 'discontinued') | NOT NULL, DEFAULT 'active' | Item status |
| created_by | INT | FOREIGN KEY → users(id) | User who created record |
| updated_by | INT | FOREIGN KEY → users(id) | User who last updated record |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_name` (name)
- `idx_sku` (sku)
- `idx_category` (category)
- `idx_company_id` (company_id)
- `idx_status` (status)
- `idx_current_quantity` (current_quantity)
- `idx_min_stock_level` (min_stock_level)
- `idx_created_at` (created_at)
- `idx_low_stock` (company_id, current_quantity, min_stock_level)

### inventory_transactions
All inventory movement transactions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique transaction identifier |
| inventory_item_id | INT | NOT NULL, FOREIGN KEY → inventory_items(id) | Item reference |
| type | ENUM('purchase', 'sale', 'adjustment', 'transfer') | NOT NULL | Transaction type |
| quantity | DECIMAL(10,2) | NOT NULL | Quantity change (+ or -) |
| unit_price | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | Price per unit |
| total_amount | DECIMAL(10,2) | GENERATED ALWAYS AS (ABS(quantity) * unit_price) STORED | Calculated total |
| previous_quantity | DECIMAL(10,2) | NULL | Quantity before transaction |
| new_quantity | DECIMAL(10,2) | NULL | Quantity after transaction |
| reference_id | VARCHAR(100) | NULL | External reference (PO, invoice, etc.) |
| description | TEXT | NULL | Transaction description |
| transaction_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Transaction timestamp |
| performed_by | INT | FOREIGN KEY → users(id) | User who performed transaction |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes:**
- `idx_inventory_item_id` (inventory_item_id)
- `idx_type` (type)
- `idx_transaction_date` (transaction_date)
- `idx_performed_by` (performed_by)
- `idx_reference_id` (reference_id)
- `idx_created_at` (created_at)

### purchase_records
Purchase transaction records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique purchase identifier |
| inventory_item_id | INT | NOT NULL, FOREIGN KEY → inventory_items(id) | Item reference |
| quantity | DECIMAL(10,2) | NOT NULL | Purchased quantity |
| unit_price | DECIMAL(10,2) | NOT NULL | Purchase price per unit |
| total_amount | DECIMAL(10,2) | GENERATED ALWAYS AS (quantity * unit_price) STORED | Calculated total |
| supplier | VARCHAR(255) | NULL | Supplier name |
| invoice_number | VARCHAR(100) | NULL | Invoice/PO number |
| purchase_date | DATE | NOT NULL | Purchase date |
| description | TEXT | NULL | Purchase description |
| uploaded_by | INT | FOREIGN KEY → users(id) | User who uploaded record |
| source_file | VARCHAR(255) | NULL | Source file name |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_inventory_item_id` (inventory_item_id)
- `idx_purchase_date` (purchase_date)
- `idx_supplier` (supplier)
- `idx_invoice_number` (invoice_number)
- `idx_uploaded_by` (uploaded_by)
- `idx_source_file` (source_file)
- `idx_created_at` (created_at)

### sales_records
Sales transaction records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique sale identifier |
| inventory_item_id | INT | NOT NULL, FOREIGN KEY → inventory_items(id) | Item reference |
| quantity | DECIMAL(10,2) | NOT NULL | Sold quantity |
| unit_price | DECIMAL(10,2) | NOT NULL | Sale price per unit |
| total_amount | DECIMAL(10,2) | GENERATED ALWAYS AS (quantity * unit_price) STORED | Calculated total |
| customer | VARCHAR(255) | NULL | Customer name |
| invoice_number | VARCHAR(100) | NULL | Invoice number |
| sale_date | DATE | NOT NULL | Sale date |
| description | TEXT | NULL | Sale description |
| uploaded_by | INT | FOREIGN KEY → users(id) | User who uploaded record |
| source_file | VARCHAR(255) | NULL | Source file name |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_inventory_item_id` (inventory_item_id)
- `idx_sale_date` (sale_date)
- `idx_customer` (customer)
- `idx_invoice_number` (invoice_number)
- `idx_uploaded_by` (uploaded_by)
- `idx_source_file` (source_file)
- `idx_created_at` (created_at)

### audit_trail
System audit trail for tracking all changes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique audit identifier |
| user_id | INT | FOREIGN KEY → users(id) | User who made change |
| action | VARCHAR(50) | NOT NULL | Action performed (create, update, delete) |
| entity_type | VARCHAR(50) | NOT NULL | Type of entity changed |
| entity_id | INT | NOT NULL | ID of changed entity |
| changes | JSON | NULL | JSON of changes made |
| ip_address | VARCHAR(45) | NULL | User's IP address |
| user_agent | TEXT | NULL | User's browser/client info |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Audit timestamp |

**Indexes:**
- `idx_user_id` (user_id)
- `idx_action` (action)
- `idx_entity_type` (entity_type)
- `idx_entity_id` (entity_id)
- `idx_entity_lookup` (entity_type, entity_id)
- `idx_created_at` (created_at)

### notifications
User notifications and alerts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique notification identifier |
| user_id | INT | FOREIGN KEY → users(id) | Target user |
| type | ENUM('info', 'warning', 'error', 'success') | NOT NULL, DEFAULT 'info' | Notification type |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| data | JSON | NULL | Additional notification data |
| read_at | TIMESTAMP | NULL | Read timestamp |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Indexes:**
- `idx_user_id` (user_id)
- `idx_type` (type)
- `idx_read_at` (read_at)
- `idx_created_at` (created_at)
- `idx_unread` (user_id, read_at)

### file_uploads
File upload tracking and processing status.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique upload identifier |
| original_name | VARCHAR(255) | NOT NULL | Original filename |
| stored_name | VARCHAR(255) | NOT NULL | Stored filename |
| file_path | VARCHAR(500) | NOT NULL | Full file path |
| file_type | VARCHAR(50) | NOT NULL | File extension |
| file_size | INT | NOT NULL | File size in bytes |
| mime_type | VARCHAR(100) | NULL | MIME type |
| status | ENUM('uploaded', 'processing', 'completed', 'failed') | NOT NULL, DEFAULT 'uploaded' | Processing status |
| processed_records | INT | DEFAULT 0 | Number of processed records |
| failed_records | INT | DEFAULT 0 | Number of failed records |
| error_messages | JSON | NULL | Processing error messages |
| company_matches | JSON | NULL | Company matching results |
| uploaded_by | INT | FOREIGN KEY → users(id) | User who uploaded file |
| processed_at | TIMESTAMP | NULL | Processing completion time |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Upload timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_original_name` (original_name)
- `idx_file_type` (file_type)
- `idx_status` (status)
- `idx_uploaded_by` (uploaded_by)
- `idx_created_at` (created_at)

### user_tokens
JWT refresh tokens and other user tokens.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique token identifier |
| user_id | INT | NOT NULL, FOREIGN KEY → users(id) | Token owner |
| token | TEXT | NOT NULL | Token value |
| type | ENUM('refresh', 'password_reset', 'email_verification') | NOT NULL, DEFAULT 'refresh' | Token type |
| expires_at | TIMESTAMP | NOT NULL | Token expiration time |
| used_at | TIMESTAMP | NULL | Token usage timestamp |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Token creation time |

**Indexes:**
- `idx_user_id` (user_id)
- `idx_type` (type)
- `idx_expires_at` (expires_at)
- `idx_token_lookup` (user_id, type, expires_at)

### migrations
Database migration tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique migration identifier |
| migration | VARCHAR(255) | NOT NULL, UNIQUE | Migration filename |
| executed_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Execution timestamp |

## Relationships

### Foreign Key Constraints

1. **companies.created_by** → users.id (SET NULL)
2. **company_partners.company_id** → companies.id (CASCADE)
3. **company_partners.user_id** → users.id (CASCADE)
4. **company_partners.assigned_by** → users.id (SET NULL)
5. **inventory_items.company_id** → companies.id (CASCADE)
6. **inventory_items.created_by** → users.id (SET NULL)
7. **inventory_items.updated_by** → users.id (SET NULL)
8. **inventory_transactions.inventory_item_id** → inventory_items.id (CASCADE)
9. **inventory_transactions.performed_by** → users.id (SET NULL)
10. **purchase_records.inventory_item_id** → inventory_items.id (CASCADE)
11. **purchase_records.uploaded_by** → users.id (SET NULL)
12. **sales_records.inventory_item_id** → inventory_items.id (CASCADE)
13. **sales_records.uploaded_by** → users.id (SET NULL)
14. **audit_trail.user_id** → users.id (SET NULL)
15. **notifications.user_id** → users.id (CASCADE)
16. **file_uploads.uploaded_by** → users.id (SET NULL)
17. **user_tokens.user_id** → users.id (CASCADE)

## Data Integrity Rules

### Business Rules

1. **Role Hierarchy**: SuperAdmin > Manager > Partner
2. **Company Access**: Partners can only access assigned companies
3. **Inventory Ownership**: Each inventory item belongs to exactly one company
4. **Stock Levels**: current_quantity should not go below 0
5. **Low Stock**: Items with current_quantity ≤ min_stock_level trigger alerts
6. **Audit Trail**: All CUD operations are logged
7. **Soft Deletes**: Most entities use status fields instead of hard deletes

### Sample Data

The system includes sample data for:
- 3 default users (superadmin, manager, partner)
- 5 sample companies
- 5 sample inventory items
- Sample purchase and sales records
- Sample notifications

## Performance Considerations

1. **Indexing**: All foreign keys and frequently queried columns are indexed
2. **Computed Columns**: total_value fields are computed automatically
3. **JSON Fields**: Used for flexible data storage (audit changes, notifications)
4. **Partitioning**: Consider partitioning audit_trail by date for large datasets
5. **Archiving**: Archive old transactions and audit records regularly
