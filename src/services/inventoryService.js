/**
 * Inventory Service
 * Handles inventory data operations through API
 */

import apiService from './api.js';

class InventoryService {
  /**
   * Get all inventory items with optional filtering
   */
  async getInventoryItems(filters = {}) {
    try {
      const response = await apiService.getInventory(filters);
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.message || 'Failed to fetch inventory items');
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  }

  /**
   * Get a single inventory item by ID
   */
  async getInventoryItem(id) {
    try {
      const response = await apiService.getInventoryItem(id);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch inventory item');
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  }

  /**
   * Create a new inventory item
   */
  async createInventoryItem(itemData) {
    try {
      const response = await apiService.createInventoryItem(itemData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create inventory item');
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  }

  /**
   * Update an existing inventory item
   */
  async updateInventoryItem(id, updates) {
    try {
      const response = await apiService.updateInventoryItem(id, updates);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update inventory item');
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  }

  /**
   * Delete an inventory item
   */
  async deleteInventoryItem(id) {
    try {
      const response = await apiService.deleteInventoryItem(id);
      if (response.success) {
        return true;
      }
      throw new Error(response.message || 'Failed to delete inventory item');
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }

  /**
   * Get low stock items
   */
  async getLowStockItems() {
    try {
      const response = await apiService.getLowStockItems();
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.message || 'Failed to fetch low stock items');
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
  }

  /**
   * Get transactions
   */
  async getTransactions(filters = {}) {
    try {
      const response = await apiService.getTransactions(filters);
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.message || 'Failed to fetch transactions');
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * Create a transaction
   */
  async createTransaction(transactionData) {
    try {
      const response = await apiService.createTransaction(transactionData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create transaction');
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Upload and process file
   */
  async uploadFile(file) {
    try {
      const response = await apiService.uploadFile(file);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to upload file');
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Process uploaded file
   */
  async processFile(fileId) {
    try {
      const response = await apiService.processFile(fileId);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to process file');
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }

  /**
   * Get file uploads
   */
  async getUploads(params = {}) {
    try {
      const response = await apiService.getUploads(params);
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.message || 'Failed to fetch uploads');
    } catch (error) {
      console.error('Error fetching uploads:', error);
      throw error;
    }
  }

  /**
   * Get inventory statistics
   */
  async getInventoryStats() {
    try {
      const response = await apiService.getInventoryStats();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch inventory stats');
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      throw error;
    }
  }

  /**
   * Get dashboard data
   */
  async getDashboardData() {
    try {
      const response = await apiService.getDashboardData();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch dashboard data');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  /**
   * Export inventory data
   */
  async exportData(type = 'inventory', format = 'csv') {
    try {
      const response = await apiService.exportData(type, format);
      return response;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const inventoryService = new InventoryService();
export default inventoryService;
