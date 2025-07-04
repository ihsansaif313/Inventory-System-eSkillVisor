/**
 * Company Service
 * Handles company data operations through API
 */

import apiService from './api.js';

class CompanyService {
  /**
   * Get all companies with optional filtering
   */
  async getCompanies(filters = {}) {
    try {
      const response = await apiService.getCompanies(filters);
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.message || 'Failed to fetch companies');
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  /**
   * Get a single company by ID
   */
  async getCompany(id) {
    try {
      const response = await apiService.getCompany(id);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch company');
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  }

  /**
   * Create a new company
   */
  async createCompany(companyData) {
    try {
      const response = await apiService.createCompany(companyData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create company');
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  /**
   * Update an existing company
   */
  async updateCompany(id, updates) {
    try {
      const response = await apiService.updateCompany(id, updates);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update company');
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  /**
   * Delete a company
   */
  async deleteCompany(id) {
    try {
      const response = await apiService.deleteCompany(id);
      if (response.success) {
        return true;
      }
      throw new Error(response.message || 'Failed to delete company');
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }

  /**
   * Assign partner to company
   */
  async assignPartner(companyId, userId) {
    try {
      const response = await apiService.assignPartner(companyId, userId);
      if (response.success) {
        return true;
      }
      throw new Error(response.message || 'Failed to assign partner');
    } catch (error) {
      console.error('Error assigning partner:', error);
      throw error;
    }
  }

  /**
   * Remove partner from company
   */
  async removePartner(companyId, partnerId) {
    try {
      const response = await apiService.removePartner(companyId, partnerId);
      if (response.success) {
        return true;
      }
      throw new Error(response.message || 'Failed to remove partner');
    } catch (error) {
      console.error('Error removing partner:', error);
      throw error;
    }
  }

  /**
   * Get company statistics
   */
  async getCompanyStats() {
    try {
      const response = await apiService.getCompanyStats();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch company stats');
    } catch (error) {
      console.error('Error fetching company stats:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const companyService = new CompanyService();
export default companyService;
