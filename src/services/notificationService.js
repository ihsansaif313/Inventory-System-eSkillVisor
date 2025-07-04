/**
 * Notification Service
 * Handles notification operations through API
 */

import apiService from './api.js';

class NotificationService {
  /**
   * Get all notifications with optional filtering
   */
  async getNotifications(filters = {}) {
    try {
      const response = await apiService.getNotifications(filters);
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.message || 'Failed to fetch notifications');
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id) {
    try {
      const response = await apiService.markNotificationAsRead(id);
      if (response.success) {
        return true;
      }
      throw new Error(response.message || 'Failed to mark notification as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      const response = await apiService.markAllNotificationsAsRead();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to mark all notifications as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id) {
    try {
      const response = await apiService.deleteNotification(id);
      if (response.success) {
        return true;
      }
      throw new Error(response.message || 'Failed to delete notification');
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount() {
    try {
      const response = await this.getNotifications({ unread_only: true });
      return response.unread_count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }
}

// Create and export a singleton instance
const notificationService = new NotificationService();
export default notificationService;
