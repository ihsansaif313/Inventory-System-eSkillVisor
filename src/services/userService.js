/**
 * User Service
 * Handles user data operations through API
 */

import apiService from './api.js';

class UserService {
  /**
   * Get all users with optional filtering
   */
  async getUsers(filters = {}) {
    try {
      const response = await apiService.getUsers(filters);
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.message || 'Failed to fetch users');
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get a single user by ID
   */
  async getUser(id) {
    try {
      const response = await apiService.getUser(id);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch user');
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    try {
      const response = await apiService.createUser(userData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create user');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(id, updates) {
    try {
      const response = await apiService.updateUser(id, updates);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update user');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id) {
    try {
      const response = await apiService.deleteUser(id);
      if (response.success) {
        return true;
      }
      throw new Error(response.message || 'Failed to delete user');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const userService = new UserService();
export default userService;
