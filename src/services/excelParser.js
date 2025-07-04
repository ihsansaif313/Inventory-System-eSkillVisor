// Excel parsing configuration
/**
 * @typedef {Object} ExcelParseConfig
 * @property {string} [sheetName] - Name of the Excel sheet to parse
 * @property {number} [headerRow] - Row number containing headers
 * @property {Object} [columnMapping] - Mapping of column names to fields
 * @property {string} [dateFormat] - Date format to use
 * @property {boolean} [skipEmptyRows] - Whether to skip empty rows
 */

// Column mapping for different Excel formats
const DEFAULT_COLUMN_MAPPINGS = {
  inventory: {
    'Item Name': 'name',
    'Product Name': 'name',
    'Name': 'name',
    'SKU': 'sku',
    'Product Code': 'sku',
    'Category': 'category',
    'Type': 'category',
    'Quantity': 'currentQuantity',
    'Stock': 'currentQuantity',
    'Current Stock': 'currentQuantity',
    'Unit Price': 'unitPrice',
    'Price': 'unitPrice',
    'Cost': 'unitPrice',
    'Company': 'companyName',
    'Company Name': 'companyName',
    'Client': 'companyName',
    'Description': 'description',
    'Min Stock': 'minStockLevel',
    'Minimum': 'minStockLevel',
    'Max Stock': 'maxStockLevel',
    'Maximum': 'maxStockLevel'
  },
  purchases: {
    'Item Name': 'itemName',
    'Product': 'itemName',
    'Quantity': 'quantity',
    'Qty': 'quantity',
    'Unit Price': 'unitPrice',
    'Price': 'unitPrice',
    'Total': 'totalAmount',
    'Amount': 'totalAmount',
    'Company': 'companyName',
    'Supplier': 'supplier',
    'Vendor': 'supplier',
    'Date': 'purchaseDate',
    'Purchase Date': 'purchaseDate',
    'Invoice': 'invoiceNumber',
    'Invoice Number': 'invoiceNumber',
    'Description': 'description',
    'Notes': 'description'
  },
  sales: {
    'Item Name': 'itemName',
    'Product': 'itemName',
    'Quantity': 'quantity',
    'Qty': 'quantity',
    'Unit Price': 'unitPrice',
    'Price': 'unitPrice',
    'Total': 'totalAmount',
    'Amount': 'totalAmount',
    'Company': 'companyName',
    'Customer': 'customer',
    'Client': 'customer',
    'Date': 'saleDate',
    'Sale Date': 'saleDate',
    'Invoice': 'invoiceNumber',
    'Invoice Number': 'invoiceNumber',
    'Description': 'description',
    'Notes': 'description'
  }
};

// Mock Excel parsing function (in real implementation, would use a library like xlsx or exceljs)
const parseExcelFile = async (file) => {
  // This is a mock implementation
  // In a real application, you would use a library like 'xlsx' or 'exceljs'
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Excel data - simulating parsed rows
      const mockData = [
        // Header row
        ['Item Name', 'SKU', 'Category', 'Quantity', 'Unit Price', 'Company', 'Description'],
        // Data rows
        ['Office Chairs Premium', 'OFC-001-PREM', 'Office Furniture', '15', '349.99', 'Acme Corp', 'Ergonomic office chairs with premium features'],
        ['Wireless Mouse', 'MSE-002', 'Electronics', '50', '29.99', 'TechStart Inc', 'Bluetooth wireless mouse'],
        ['Steel Rods', 'STL-003-ROD', 'Raw Materials', '200', '12.50', 'Global Ventures', 'High-grade steel rods for construction'],
        ['Software License Pro', 'SFT-004-PRO', 'Software', '25', '89.99', 'Future Fund', 'Professional software license'],
        ['Marketing Banners', 'MKT-005-BAN', 'Marketing', '10', '45.00', 'Capital Partners', 'Promotional banners for events'],
        // Some rows with missing data to test validation
        ['Incomplete Item', '', 'Electronics', '5', '', 'Unknown Company', ''],
        ['', 'EMPTY-001', 'Test', '0', '10.00', 'Test Company', 'Empty name test']
      ];
      resolve(mockData);
    }, 1000);
  });
};

// Detect sheet type based on headers
const detectSheetType = (headers) => {
  const headerStr = headers.join(' ').toLowerCase();
  
  if (headerStr.includes('supplier') || headerStr.includes('vendor') || headerStr.includes('purchase')) {
    return 'purchases';
  }
  
  if (headerStr.includes('customer') || headerStr.includes('client') || headerStr.includes('sale')) {
    return 'sales';
  }
  
  if (headerStr.includes('stock') || headerStr.includes('inventory') || headerStr.includes('quantity')) {
    return 'inventory';
  }
  
  return 'unknown';
};

// Map Excel row to object based on column mapping
const mapRowToObject = (row, headers, mapping) => {
  const obj = {};
  
  headers.forEach((header, index) => {
    const mappedField = mapping[header];
    if (mappedField && row[index] !== undefined && row[index] !== '') {
      obj[mappedField] = row[index];
    }
  });
  
  return obj;
};

// Validate and clean data
const validateInventoryItem = (item) => {
  const errors = [];
  const cleanedItem = { ...item };
  
  // Required fields
  if (!item.name || item.name.trim() === '') {
    errors.push('Item name is required');
  } else {
    cleanedItem.name = item.name.trim();
  }
  
  if (!item.companyName || item.companyName.trim() === '') {
    errors.push('Company name is required');
  } else {
    cleanedItem.companyName = item.companyName.trim();
  }
  
  // Numeric validations
  if (item.currentQuantity !== undefined) {
    const qty = parseFloat(item.currentQuantity);
    if (isNaN(qty) || qty < 0) {
      errors.push('Quantity must be a valid positive number');
    } else {
      cleanedItem.currentQuantity = qty;
    }
  }
  
  if (item.unitPrice !== undefined) {
    const price = parseFloat(item.unitPrice);
    if (isNaN(price) || price < 0) {
      errors.push('Unit price must be a valid positive number');
    } else {
      cleanedItem.unitPrice = price;
    }
  }
  
  if (item.minStockLevel !== undefined) {
    const minStock = parseFloat(item.minStockLevel);
    if (isNaN(minStock) || minStock < 0) {
      errors.push('Minimum stock level must be a valid positive number');
    } else {
      cleanedItem.minStockLevel = minStock;
    }
  }
  
  // Set defaults
  cleanedItem.category = cleanedItem.category || 'Uncategorized';
  cleanedItem.status = 'active';
  cleanedItem.currentQuantity = cleanedItem.currentQuantity || 0;
  cleanedItem.unitPrice = cleanedItem.unitPrice || 0;
  cleanedItem.minStockLevel = cleanedItem.minStockLevel || 0;
  cleanedItem.totalValue = cleanedItem.currentQuantity * cleanedItem.unitPrice;
  
  return {
    isValid: errors.length === 0,
    errors,
    cleanedItem: errors.length === 0 ? cleanedItem : undefined
  };
};

// Validate purchase/sale record
const validateTransactionRecord = (record, type) => {
  const errors = [];
  const cleanedRecord = { ...record };
  
  // Required fields
  if (!record.itemName || record.itemName.trim() === '') {
    errors.push('Item name is required');
  } else {
    cleanedRecord.itemName = record.itemName.trim();
  }
  
  if (!record.companyName || record.companyName.trim() === '') {
    errors.push('Company name is required');
  } else {
    cleanedRecord.companyName = record.companyName.trim();
  }
  
  // Numeric validations
  const qty = parseFloat(record.quantity);
  if (isNaN(qty) || qty <= 0) {
    errors.push('Quantity must be a valid positive number');
  } else {
    cleanedRecord.quantity = qty;
  }
  
  const price = parseFloat(record.unitPrice);
  if (isNaN(price) || price < 0) {
    errors.push('Unit price must be a valid positive number');
  } else {
    cleanedRecord.unitPrice = price;
  }
  
  // Calculate total if not provided
  if (!record.totalAmount) {
    cleanedRecord.totalAmount = cleanedRecord.quantity * cleanedRecord.unitPrice;
  } else {
    const total = parseFloat(record.totalAmount);
    if (isNaN(total) || total < 0) {
      errors.push('Total amount must be a valid positive number');
    } else {
      cleanedRecord.totalAmount = total;
    }
  }
  
  // Date validation
  const dateField = type === 'purchase' ? 'purchaseDate' : 'saleDate';
  if (record[dateField]) {
    const date = new Date(record[dateField]);
    if (isNaN(date.getTime())) {
      errors.push(`${type} date is invalid`);
    } else {
      cleanedRecord[dateField] = date.toISOString();
    }
  } else {
    // Default to current date
    cleanedRecord[dateField] = new Date().toISOString();
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    cleanedRecord: errors.length === 0 ? cleanedRecord : undefined
  };
};

// Main Excel parser service
export class ExcelParserService {
  static async parseInventoryFile(file, config = {}) {
    const result = {
      purchases: [],
      sales: [],
      items: [],
      companyMatches: [],
      errors: []
    };
    
    try {
      // Parse Excel file
      const rows = await parseExcelFile(file);
      
      if (rows.length === 0) {
        result.errors.push('Excel file is empty');
        return result;
      }
      
      // Get headers (first row)
      const headers = rows[0].map(h => String(h).trim());
      const dataRows = rows.slice(config.headerRow || 1);
      
      // Detect sheet type
      const sheetType = detectSheetType(headers);
      
      if (sheetType === 'unknown') {
        result.errors.push('Unable to determine sheet type. Please ensure headers include relevant keywords.');
        return result;
      }
      
      // Get appropriate column mapping
      const mapping = config.columnMapping || DEFAULT_COLUMN_MAPPINGS[sheetType];
      
      // Process each row
      dataRows.forEach((row, index) => {
        const rowNumber = index + (config.headerRow || 1) + 1;
        
        // Skip empty rows
        if (config.skipEmptyRows !== false && row.every(cell => !cell || String(cell).trim() === '')) {
          return;
        }
        
        // Map row to object
        const mappedData = mapRowToObject(row, headers, mapping);
        
        if (Object.keys(mappedData).length === 0) {
          result.errors.push(`Row ${rowNumber}: No valid data found`);
          return;
        }
        
        // Validate and process based on sheet type
        if (sheetType === 'inventory') {
          const validation = validateInventoryItem(mappedData);
          if (validation.isValid && validation.cleanedItem) {
            result.items.push(validation.cleanedItem);
          } else {
            result.errors.push(`Row ${rowNumber}: ${validation.errors.join(', ')}`);
          }
        } else if (sheetType === 'purchases') {
          const validation = validateTransactionRecord(mappedData, 'purchase');
          if (validation.isValid && validation.cleanedRecord) {
            result.purchases.push(validation.cleanedRecord);
          } else {
            result.errors.push(`Row ${rowNumber}: ${validation.errors.join(', ')}`);
          }
        } else if (sheetType === 'sales') {
          const validation = validateTransactionRecord(mappedData, 'sale');
          if (validation.isValid && validation.cleanedRecord) {
            result.sales.push(validation.cleanedRecord);
          } else {
            result.errors.push(`Row ${rowNumber}: ${validation.errors.join(', ')}`);
          }
        }
      });
      
      // Extract unique company names for matching
      const companyNames = new Set();
      [...result.items, ...result.purchases, ...result.sales].forEach(item => {
        if (item.companyName) {
          companyNames.add(item.companyName);
        }
      });
      
      // Create company matches (this would be enhanced by the company matching algorithm)
      companyNames.forEach(name => {
        result.companyMatches.push({
          originalName: name,
          matchedCompanyId: '', // To be filled by company matching service
          matchedCompanyName: name,
          confidence: 0.8, // Mock confidence score
          isManualMatch: false
        });
      });
      
    } catch (error) {
      result.errors.push(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return result;
  }
  
  // Get supported column headers for different sheet types
  static getSupportedHeaders(sheetType) {
    return Object.keys(DEFAULT_COLUMN_MAPPINGS[sheetType]);
  }
  
  // Validate Excel file before processing
  static validateExcelFile(file) {
    const errors = [];
    
    // Check file type
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      errors.push('Invalid file type. Please upload an Excel file (.xlsx or .xls)');
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('File size exceeds 10MB limit');
    }
    
    // Check if file is empty
    if (file.size === 0) {
      errors.push('File is empty');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default ExcelParserService;
