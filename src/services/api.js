/**
 * API Service for EskillVisor Backend Integration
 */

const API_BASE_URL = 'http://localhost/EskillVisor/backend';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication endpoints
  async login(email, password) {
    const response = await this.post('/api/auth/login', { email, password });
    if (response.success && response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response;
  }

  async logout() {
    try {
      await this.post('/api/auth/logout');
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    return this.get('/api/auth/me');
  }

  async refreshToken(refreshToken) {
    const response = await this.post('/api/auth/refresh', { refresh_token: refreshToken });
    if (response.success && response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response;
  }

  // User management endpoints
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/api/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUser(id) {
    return this.get(`/api/users/${id}`);
  }

  async createUser(userData) {
    return this.post('/api/users', userData);
  }

  async updateUser(id, userData) {
    return this.put(`/api/users/${id}`, userData);
  }

  async deleteUser(id) {
    return this.delete(`/api/users/${id}`);
  }

  // Company management endpoints
  async getCompanies(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/api/companies${queryString ? `?${queryString}` : ''}`);
  }

  async getCompany(id) {
    return this.get(`/api/companies/${id}`);
  }

  async createCompany(companyData) {
    return this.post('/api/companies', companyData);
  }

  async updateCompany(id, companyData) {
    return this.put(`/api/companies/${id}`, companyData);
  }

  async deleteCompany(id) {
    return this.delete(`/api/companies/${id}`);
  }

  async assignPartner(companyId, userId) {
    return this.post(`/api/companies/${companyId}/partners`, { user_id: userId });
  }

  async removePartner(companyId, partnerId) {
    return this.delete(`/api/companies/${companyId}/partners/${partnerId}`);
  }

  // Inventory management endpoints
  async getInventory(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/api/inventory${queryString ? `?${queryString}` : ''}`);
  }

  async getInventoryItem(id) {
    return this.get(`/api/inventory/${id}`);
  }

  async createInventoryItem(itemData) {
    return this.post('/api/inventory', itemData);
  }

  async updateInventoryItem(id, itemData) {
    return this.put(`/api/inventory/${id}`, itemData);
  }

  async deleteInventoryItem(id) {
    return this.delete(`/api/inventory/${id}`);
  }

  async getLowStockItems() {
    return this.get('/api/inventory/low-stock');
  }

  async getTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/api/transactions${queryString ? `?${queryString}` : ''}`);
  }

  async createTransaction(transactionData) {
    return this.post('/api/transactions', transactionData);
  }

  // File upload endpoints
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/api/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'File upload failed');
    }

    return data;
  }

  async getUploads(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/api/files/uploads${queryString ? `?${queryString}` : ''}`);
  }

  async processFile(fileId) {
    return this.post(`/api/files/process/${fileId}`);
  }

  // Analytics endpoints
  async getDashboardData() {
    return this.get('/api/analytics/dashboard');
  }

  async getInventoryStats() {
    return this.get('/api/analytics/inventory-stats');
  }

  async getCompanyStats() {
    return this.get('/api/analytics/company-stats');
  }

  async getTrends() {
    return this.get('/api/analytics/trends');
  }

  async exportData(type, format = 'csv') {
    return this.get(`/api/analytics/export?type=${type}&format=${format}`);
  }

  // Notification endpoints
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/api/notifications${queryString ? `?${queryString}` : ''}`);
  }

  async markNotificationAsRead(id) {
    return this.put(`/api/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.post('/api/notifications/mark-all-read');
  }

  async deleteNotification(id) {
    return this.delete(`/api/notifications/${id}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
