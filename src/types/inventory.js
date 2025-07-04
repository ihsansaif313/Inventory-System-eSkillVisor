// Inventory Management Types and Data Structures
// This file contains JSDoc type definitions for inventory management

/**
 * @typedef {Object} InventoryItem
 * @property {string} id - Unique identifier for the inventory item
 * @property {string} name - Name of the inventory item
 * @property {string} [description] - Optional description of the item
 * @property {string} [sku] - Stock Keeping Unit identifier
 * @property {string} category - Category of the inventory item
 * @property {number} currentQuantity - Current quantity in stock
 * @property {number} minStockLevel - Minimum stock level threshold
 * @property {number} [maxStockLevel] - Maximum stock level threshold
 * @property {number} unitPrice - Price per unit
 * @property {number} totalValue - Total value of current stock
 * @property {string} companyId - ID of the company that owns this item
 * @property {string} companyName - Name of the company that owns this item
 * @property {string} lastUpdated - ISO date string of last update
 * @property {string} createdAt - ISO date string of creation
 * @property {string} updatedBy - User who last updated the item
 * @property {'active'|'inactive'|'discontinued'} status - Current status of the item
 */

/**
 * @typedef {Object} PurchaseRecord
 * @property {string} id - Unique identifier for the purchase record
 * @property {string} inventoryItemId - ID of the related inventory item
 * @property {string} itemName - Name of the purchased item
 * @property {number} quantity - Quantity purchased
 * @property {number} unitPrice - Price per unit purchased
 * @property {number} totalAmount - Total amount of the purchase
 * @property {string} companyId - ID of the purchasing company
 * @property {string} companyName - Name of the purchasing company
 * @property {string} [supplier] - Name of the supplier
 * @property {string} purchaseDate - ISO date string of purchase
 * @property {string} [invoiceNumber] - Invoice number for the purchase
 * @property {string} [description] - Description of the purchase
 * @property {string} uploadedBy - User who uploaded this record
 * @property {string} uploadedAt - ISO date string of upload
 * @property {string} [sourceFile] - Source file name if uploaded from file
 */

/**
 * @typedef {Object} SalesRecord
 * @property {string} id - Unique identifier for the sales record
 * @property {string} inventoryItemId - ID of the related inventory item
 * @property {string} itemName - Name of the sold item
 * @property {number} quantity - Quantity sold
 * @property {number} unitPrice - Price per unit sold
 * @property {number} totalAmount - Total amount of the sale
 * @property {string} companyId - ID of the selling company
 * @property {string} companyName - Name of the selling company
 * @property {string} [customer] - Name of the customer
 * @property {string} saleDate - ISO date string of sale
 * @property {string} [invoiceNumber] - Invoice number for the sale
 * @property {string} [description] - Description of the sale
 * @property {string} uploadedBy - User who uploaded this record
 * @property {string} uploadedAt - ISO date string of upload
 * @property {string} [sourceFile] - Source file name if uploaded from file
 */

/**
 * @typedef {Object} InventoryTransaction
 * @property {string} id - Unique identifier for the transaction
 * @property {string} inventoryItemId - ID of the related inventory item
 * @property {'purchase'|'sale'|'adjustment'|'transfer'} type - Type of transaction
 * @property {number} quantity - Quantity involved in transaction
 * @property {number} [unitPrice] - Price per unit for the transaction
 * @property {number} [totalAmount] - Total amount of the transaction
 * @property {string} companyId - ID of the company
 * @property {string} companyName - Name of the company
 * @property {string} transactionDate - ISO date string of transaction
 * @property {string} [description] - Description of the transaction
 * @property {string} [referenceId] - Links to purchase or sales record
 * @property {string} performedBy - User who performed the transaction
 * @property {string} performedAt - ISO date string when performed
 * @property {number} previousQuantity - Quantity before transaction
 * @property {number} newQuantity - Quantity after transaction
 */

/**
 * @typedef {Object} FileUploadRecord
 * @property {string} id - Unique identifier for the upload record
 * @property {string} fileName - Name of the uploaded file
 * @property {'excel'|'pdf'} fileType - Type of the uploaded file
 * @property {number} fileSize - Size of the file in bytes
 * @property {string} uploadedBy - User who uploaded the file
 * @property {string} uploadedAt - ISO date string of upload
 * @property {'pending'|'processing'|'completed'|'failed'} status - Processing status
 * @property {number} processedRecords - Number of successfully processed records
 * @property {number} failedRecords - Number of failed records
 * @property {string[]} [errorMessages] - Array of error messages
 * @property {CompanyMatch[]} [companyMatches] - Array of company matches
 */

/**
 * @typedef {Object} CompanyMatch
 * @property {string} originalName - Original company name from file
 * @property {string} matchedCompanyId - ID of the matched company
 * @property {string} matchedCompanyName - Name of the matched company
 * @property {number} confidence - Confidence score of the match (0-1)
 * @property {boolean} isManualMatch - Whether this was manually matched
 */

/**
 * @typedef {Object} InventoryFilter
 * @property {string} [companyId] - Filter by company ID
 * @property {string} [category] - Filter by category
 * @property {'active'|'inactive'|'discontinued'} [status] - Filter by status
 * @property {boolean} [lowStock] - Filter for low stock items
 * @property {Object} [dateRange] - Filter by date range
 * @property {string} dateRange.start - Start date for range
 * @property {string} dateRange.end - End date for range
 * @property {string} [searchTerm] - Search term for filtering
 */

/**
 * @typedef {Object} InventoryStats
 * @property {number} totalItems - Total number of inventory items
 * @property {number} totalValue - Total value of all inventory
 * @property {number} lowStockItems - Number of items with low stock
 * @property {number} companiesCount - Number of companies
 * @property {number} recentTransactions - Number of recent transactions
 * @property {Array<{category: string, count: number, value: number}>} topCategories - Top categories by count/value
 */

/**
 * @typedef {Object} AuditTrail
 * @property {string} id - Unique identifier for the audit record
 * @property {'inventory'|'purchase'|'sale'|'upload'} entityType - Type of entity
 * @property {string} entityId - ID of the entity
 * @property {'create'|'update'|'delete'|'upload'|'process'} action - Action performed
 * @property {Object} [changes] - Object containing old and new values
 * @property {string} performedBy - User who performed the action
 * @property {string} performedAt - ISO date string when performed
 * @property {string} [ipAddress] - IP address of the user
 * @property {string} [userAgent] - User agent string
 * @property {string} [description] - Description of the action
 */

/**
 * User role types for inventory access control
 * @typedef {'superadmin'|'manager'|'partner'} UserRole
 */

/**
 * @typedef {Object} InventoryPermissions
 * @property {boolean} canView - Can view inventory
 * @property {boolean} canEdit - Can edit inventory
 * @property {boolean} canUpload - Can upload files
 * @property {boolean} canDelete - Can delete items
 * @property {boolean} canViewAllCompanies - Can view all companies
 * @property {string[]} allowedCompanyIds - Array of allowed company IDs
 */

/**
 * @typedef {Object} ParsedInventoryData
 * @property {Object[]} purchases - Array of purchase records (without id, uploadedBy, uploadedAt)
 * @property {Object[]} sales - Array of sales records (without id, uploadedBy, uploadedAt)
 * @property {Object[]} items - Array of inventory items (without id, createdAt, updatedBy, lastUpdated)
 * @property {CompanyMatch[]} companyMatches - Array of company matches
 * @property {string[]} errors - Array of error messages
 */

/**
 * @typedef {Object} ExcelParseOptions
 * @property {string} [sheetName] - Name of the Excel sheet to parse
 * @property {number} [headerRow] - Row number containing headers
 * @property {Object} [columnMapping] - Mapping of column names to fields
 */

/**
 * @typedef {Object} PDFParseOptions
 * @property {boolean} [extractTables] - Whether to extract tables
 * @property {Object} [pageRange] - Range of pages to parse
 * @property {number} pageRange.start - Start page
 * @property {number} pageRange.end - End page
 * @property {string[]} [textPatterns] - Array of text patterns to match
 */

// Export empty object to make this a module
export {};
