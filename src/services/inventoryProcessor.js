/**
 * Inventory Processing Service
 * Handles inventory data processing through API
 */

import inventoryService from './inventoryService.js';
import companyService from './companyService.js';

// Processing configuration
/**
 * @typedef {Object} ProcessingConfig
 * @property {boolean} [autoCreateItems] - Whether to auto-create items
 * @property {boolean} [updateExistingItems] - Whether to update existing items
 * @property {boolean} [allowNegativeStock] - Whether to allow negative stock
 * @property {boolean} [requireCompanyMatch] - Whether company match is required
 * @property {number} [defaultMinStockLevel] - Default minimum stock level
 * @property {boolean} [auditChanges] - Whether to audit changes
 */

// Processing result
/**
 * @typedef {Object} ProcessingResult
 * @property {boolean} success - Whether processing was successful
 * @property {number} processedItems - Number of processed items
 * @property {number} createdItems - Number of created items
 * @property {number} updatedItems - Number of updated items
 * @property {number} processedPurchases - Number of processed purchases
 * @property {number} processedSales - Number of processed sales
 * @property {string[]} errors - Array of error messages
 * @property {string[]} warnings - Array of warning messages
 * @property {Object[]} transactions - Array of transactions
 * @property {Object[]} auditTrail - Array of audit trail entries
 */

// Default configuration
const DEFAULT_CONFIG = {
  autoCreateItems: true,
  updateExistingItems: true,
  allowNegativeStock: false,
  requireCompanyMatch: true,
  defaultMinStockLevel: 5,
  auditChanges: true
};

// Inventory processing service
export class InventoryProcessorService {
  static config = DEFAULT_CONFIG;

  // Set processing configuration
  static setConfig(config) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Main processing function
  static async processInventoryData(parsedData, uploadedBy, sourceFile) {
    const result = {
      success: false,
      processedItems: 0,
      createdItems: 0,
      updatedItems: 0,
      processedPurchases: 0,
      processedSales: 0,
      errors: [],
      warnings: [],
      transactions: [],
      auditTrail: []
    };

    try {
      // Process inventory items through API
      if (parsedData.items && parsedData.items.length > 0) {
        const itemResult = await this.processInventoryItems(parsedData.items);

        result.processedItems = itemResult.processed;
        result.createdItems = itemResult.created;
        result.updatedItems = itemResult.updated;
        result.errors.push(...itemResult.errors);
        result.warnings.push(...itemResult.warnings);
      }

      result.success = result.errors.length === 0;

    } catch (error) {
      result.errors.push(`Processing failed: ${error.message}`);
    }

    return result;
  }

  // Process inventory items
  static async processInventoryItems(items) {
    const result = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [],
      warnings: []
    };

    for (const item of items) {
      try {
        // Validate item data
        const validation = this.validateInventoryItem(item);
        if (!validation.valid) {
          result.errors.push(`Item ${item.name}: ${validation.errors.join(', ')}`);
          continue;
        }

        // Check if item exists
        const existingItems = await inventoryService.getInventoryItems({
          search: item.name,
          company_id: item.company_id
        });

        const existingItem = existingItems.find(existing =>
          existing.name.toLowerCase() === item.name.toLowerCase() &&
          existing.company_id === item.company_id
        );

        if (existingItem && this.config.updateExistingItems) {
          // Update existing item
          await inventoryService.updateInventoryItem(existingItem.id, {
            current_quantity: item.current_quantity,
            unit_price: item.unit_price,
            min_stock_level: item.min_stock_level || this.config.defaultMinStockLevel
          });
          result.updated++;
        } else if (!existingItem && this.config.autoCreateItems) {
          // Create new item
          await inventoryService.createInventoryItem({
            name: item.name,
            description: item.description || '',
            sku: item.sku || '',
            category: item.category || 'Imported',
            current_quantity: item.current_quantity,
            min_stock_level: item.min_stock_level || this.config.defaultMinStockLevel,
            unit_price: item.unit_price,
            company_id: item.company_id,
            status: 'active'
          });
          result.created++;
        } else {
          result.warnings.push(`Item ${item.name} skipped (exists and update disabled)`);
        }

        result.processed++;

      } catch (error) {
        result.errors.push(`Item ${item.name}: ${error.message}`);
      }
    }

    return result;
  }

  // Validate inventory item
  static validateInventoryItem(item) {
    const errors = [];

    if (!item.name || item.name.trim() === '') {
      errors.push('Name is required');
    }

    if (typeof item.current_quantity !== 'number' || item.current_quantity < 0) {
      errors.push('Valid quantity is required');
    }

    if (typeof item.unit_price !== 'number' || item.unit_price < 0) {
      errors.push('Valid unit price is required');
    }

    if (!item.company_id) {
      errors.push('Company ID is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get inventory statistics
  static async getInventoryStats() {
    try {
      return await inventoryService.getInventoryStats();
    } catch (error) {
      console.error('Failed to get inventory stats:', error);
      return null;
    }
  }

  // Get low stock items
  static async getLowStockItems() {
    try {
      return await inventoryService.getLowStockItems();
    } catch (error) {
      console.error('Failed to get low stock items:', error);
      return [];
    }
  }
}

export default InventoryProcessorService;
