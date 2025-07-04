/**
 * Authentication Service
 * Handles user authentication, token management, and role-based access
 */

import apiService from './api.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.token = localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    
    // Initialize user from stored token
    if (this.token) {
      this.initializeFromToken();
    }
  }

  async initializeFromToken() {
    try {
      if (this.token) {
        apiService.setToken(this.token);
        const response = await apiService.getCurrentUser();
        if (response.success) {
          this.currentUser = response.data;
        } else {
          this.logout();
        }
      }
    } catch (error) {
      console.error('Failed to initialize from token:', error);
      this.logout();
    }
  }

  async login(email, password) {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success) {
        this.token = response.data.access_token;
        this.refreshToken = response.data.refresh_token;
        this.currentUser = response.data.user;
        
        // Store tokens
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('refresh_token', this.refreshToken);
        
        return {
          success: true,
          user: this.currentUser,
          token: this.token,
          refreshToken: this.refreshToken
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async logout() {
    try {
      if (this.token) {
        await apiService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      
      this.token = null;
      this.refreshToken = null;
      this.currentUser = null;
      apiService.setToken(null);
    }
    
    return { success: true };
  }

  async refreshAuthToken() {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiService.refreshToken(this.refreshToken);
      
      if (response.success) {
        this.token = response.data.access_token;
        localStorage.setItem('auth_token', this.token);
        apiService.setToken(this.token);
        
        return {
          success: true,
          token: this.token
        };
      } else {
        throw new Error(response.message || 'Token refresh failed');
      }
    } catch (error) {
      this.logout();
      throw new Error('Token refresh failed');
    }
  }

  async resetPassword(email) {
    try {
      const response = await apiService.post('/api/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Password reset failed');
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token && !!this.currentUser;
  }

  hasRole(role) {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles) {
    return roles.includes(this.currentUser?.role);
  }

  isSuperAdmin() {
    return this.hasRole('superadmin');
  }

  isManager() {
    return this.hasAnyRole(['superadmin', 'manager']);
  }

  isPartner() {
    return this.hasRole('partner');
  }

  canAccessCompany(companyId) {
    if (!this.currentUser) return false;
    
    // Superadmin and manager can access all companies
    if (this.hasAnyRole(['superadmin', 'manager'])) {
      return true;
    }
    
    // Partner can only access assigned companies
    if (this.hasRole('partner')) {
      return this.currentUser.assigned_companies?.some(company => company.id === companyId) || false;
    }
    
    return false;
  }

  getAccessibleCompanies() {
    if (!this.currentUser) return [];
    
    // Superadmin and manager can access all companies
    if (this.hasAnyRole(['superadmin', 'manager'])) {
      return 'all';
    }
    
    // Partner can only access assigned companies
    if (this.hasRole('partner')) {
      return this.currentUser.assigned_companies || [];
    }
    
    return [];
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
