// Validation result interface
/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {Object[]} errors - Array of validation errors
 * @property {Object[]} warnings - Array of validation warnings
 * @property {*} [cleanedData] - Cleaned data if validation passed
 */

// Error and warning interfaces
/**
 * @typedef {Object} ValidationError
 * @property {string} field - Field name
 * @property {string} message - Error message
 * @property {string} code - Error code
 * @property {'error'|'critical'} severity - Error severity
 * @property {string} [suggestion] - Suggestion for fixing
 */

// Default validation configuration
const DEFAULT_CONFIG = {
  strictMode: false,
  allowNegativeQuantities: false,
  allowZeroPrices: true,
  maxNameLength: 255,
  maxDescriptionLength: 1000,
  requiredFields: ['name', 'companyName']
};

// Error codes
export const ERROR_CODES = {
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_TYPE: 'INVALID_TYPE',
  INVALID_FORMAT: 'INVALID_FORMAT',
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  DUPLICATE_VALUE: 'DUPLICATE_VALUE',
  INVALID_REFERENCE: 'INVALID_REFERENCE',
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  DATA_INCONSISTENCY: 'DATA_INCONSISTENCY'
};

// Warning codes
export const WARNING_CODES = {
  MISSING_OPTIONAL: 'MISSING_OPTIONAL',
  UNUSUAL_VALUE: 'UNUSUAL_VALUE',
  POTENTIAL_DUPLICATE: 'POTENTIAL_DUPLICATE',
  DATA_QUALITY: 'DATA_QUALITY',
  PERFORMANCE_IMPACT: 'PERFORMANCE_IMPACT'
};

// Validation service
export class ValidationService {
  static config = DEFAULT_CONFIG;
  
  // Set validation configuration
  static setConfig(config) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  // Validate inventory item
  static validateInventoryItem(item) {
    const errors = [];
    const warnings = [];
    const cleanedData = { ...item };
    
    // Required field validation
    if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
      errors.push({
        field: 'name',
        message: 'Item name is required and must be a non-empty string',
        code: ERROR_CODES.REQUIRED_FIELD,
        severity: 'critical',
        suggestion: 'Provide a descriptive name for the inventory item'
      });
    } else {
      cleanedData.name = item.name.trim();
      
      // Name length validation
      if (cleanedData.name.length > this.config.maxNameLength) {
        errors.push({
          field: 'name',
          message: `Item name exceeds maximum length of ${this.config.maxNameLength} characters`,
          code: ERROR_CODES.OUT_OF_RANGE,
          severity: 'error',
          suggestion: 'Shorten the item name or use the description field for additional details'
        });
      }
    }
    
    // Company name validation
    if (!item.companyName || typeof item.companyName !== 'string' || item.companyName.trim() === '') {
      errors.push({
        field: 'companyName',
        message: 'Company name is required',
        code: ERROR_CODES.REQUIRED_FIELD,
        severity: 'critical',
        suggestion: 'Specify the company that owns this inventory item'
      });
    } else {
      cleanedData.companyName = item.companyName.trim();
    }
    
    // SKU validation
    if (item.sku) {
      if (typeof item.sku !== 'string') {
        errors.push({
          field: 'sku',
          message: 'SKU must be a string',
          code: ERROR_CODES.INVALID_TYPE,
          severity: 'error'
        });
      } else {
        cleanedData.sku = item.sku.trim().toUpperCase();
        
        // SKU format validation (alphanumeric with hyphens)
        if (!/^[A-Z0-9\-]+$/.test(cleanedData.sku)) {
          warnings.push({
            field: 'sku',
            message: 'SKU contains unusual characters. Consider using only letters, numbers, and hyphens',
            code: WARNING_CODES.DATA_QUALITY,
            suggestion: 'Use format like "ABC-123" for better consistency'
          });
        }
      }
    }
    
    // Quantity validation
    const quantity = this.validateNumericField(item.currentQuantity, 'currentQuantity', {
      allowNegative: this.config.allowNegativeQuantities,
      allowZero: true,
      isInteger: true
    });
    errors.push(...quantity.errors);
    warnings.push(...quantity.warnings);
    if (quantity.cleanedValue !== undefined) {
      cleanedData.currentQuantity = quantity.cleanedValue;
    }
    
    // Unit price validation
    const unitPrice = this.validateNumericField(item.unitPrice, 'unitPrice', {
      allowNegative: false,
      allowZero: this.config.allowZeroPrices,
      isInteger: false,
      minValue: 0,
      maxValue: 1000000
    });
    errors.push(...unitPrice.errors);
    warnings.push(...unitPrice.warnings);
    if (unitPrice.cleanedValue !== undefined) {
      cleanedData.unitPrice = unitPrice.cleanedValue;
    }
    
    // Category validation
    if (item.category) {
      if (typeof item.category !== 'string') {
        errors.push({
          field: 'category',
          message: 'Category must be a string',
          code: ERROR_CODES.INVALID_TYPE,
          severity: 'error'
        });
      } else {
        cleanedData.category = item.category.trim();
      }
    } else {
      cleanedData.category = 'Uncategorized';
      warnings.push({
        field: 'category',
        message: 'No category specified, defaulting to "Uncategorized"',
        code: WARNING_CODES.MISSING_OPTIONAL,
        suggestion: 'Specify a category for better organization'
      });
    }
    
    // Status validation
    if (item.status) {
      const validStatuses = ['active', 'inactive', 'discontinued'];
      if (!validStatuses.includes(item.status)) {
        errors.push({
          field: 'status',
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          code: ERROR_CODES.INVALID_FORMAT,
          severity: 'error',
          suggestion: 'Use "active" for items in regular use'
        });
      } else {
        cleanedData.status = item.status;
      }
    } else {
      cleanedData.status = 'active';
    }
    
    // Calculate total value
    if (cleanedData.currentQuantity !== undefined && cleanedData.unitPrice !== undefined) {
      cleanedData.totalValue = cleanedData.currentQuantity * cleanedData.unitPrice;
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      cleanedData: errors.length === 0 ? cleanedData : undefined
    };
  }
  
  // Validate numeric field
  static validateNumericField(value, fieldName, options) {
    const errors = [];
    const warnings = [];
    
    if (value === undefined || value === null || value === '') {
      return { errors, warnings };
    }
    
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a valid number`,
        code: ERROR_CODES.INVALID_TYPE,
        severity: 'error',
        suggestion: 'Provide a numeric value'
      });
      return { errors, warnings };
    }
    
    if (!options.allowNegative && numValue < 0) {
      errors.push({
        field: fieldName,
        message: `${fieldName} cannot be negative`,
        code: ERROR_CODES.OUT_OF_RANGE,
        severity: 'error',
        suggestion: 'Provide a positive value'
      });
    }
    
    if (!options.allowZero && numValue === 0) {
      errors.push({
        field: fieldName,
        message: `${fieldName} cannot be zero`,
        code: ERROR_CODES.OUT_OF_RANGE,
        severity: 'error',
        suggestion: 'Provide a non-zero value'
      });
    }
    
    if (options.isInteger && !Number.isInteger(numValue)) {
      warnings.push({
        field: fieldName,
        message: `${fieldName} should be a whole number`,
        code: WARNING_CODES.DATA_QUALITY,
        suggestion: 'Consider using a whole number for better accuracy'
      });
    }
    
    if (options.minValue !== undefined && numValue < options.minValue) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be at least ${options.minValue}`,
        code: ERROR_CODES.OUT_OF_RANGE,
        severity: 'error'
      });
    }
    
    if (options.maxValue !== undefined && numValue > options.maxValue) {
      errors.push({
        field: fieldName,
        message: `${fieldName} cannot exceed ${options.maxValue}`,
        code: ERROR_CODES.OUT_OF_RANGE,
        severity: 'error'
      });
    }
    
    return {
      errors,
      warnings,
      cleanedValue: errors.length === 0 ? numValue : undefined
    };
  }
  
  // Validate file upload
  static validateFileUpload(file) {
    const errors = [];
    const warnings = [];
    
    // File type validation
    const allowedTypes = ['.xlsx', '.xls', '.pdf'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      errors.push({
        field: 'file',
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        code: ERROR_CODES.INVALID_FORMAT,
        severity: 'critical',
        suggestion: 'Convert your file to Excel or PDF format'
      });
    }
    
    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push({
        field: 'file',
        message: 'File size exceeds 10MB limit',
        code: ERROR_CODES.OUT_OF_RANGE,
        severity: 'critical',
        suggestion: 'Compress the file or split into smaller files'
      });
    }
    
    // Empty file check
    if (file.size === 0) {
      errors.push({
        field: 'file',
        message: 'File is empty',
        code: ERROR_CODES.INVALID_FORMAT,
        severity: 'critical',
        suggestion: 'Ensure the file contains data'
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // Batch validate multiple items
  static batchValidate(items, validator) {
    const validItems = [];
    const invalidItems = [];
    let totalErrors = 0;
    let totalWarnings = 0;
    
    items.forEach(item => {
      const validation = validator(item);
      totalErrors += validation.errors.length;
      totalWarnings += validation.warnings.length;
      
      if (validation.isValid) {
        validItems.push(validation.cleanedData || item);
      } else {
        invalidItems.push({ item, validation });
      }
    });
    
    return {
      validItems,
      invalidItems,
      totalErrors,
      totalWarnings
    };
  }
}

export default ValidationService;
