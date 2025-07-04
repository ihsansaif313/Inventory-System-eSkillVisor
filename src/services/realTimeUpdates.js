import React from 'react';

// Real-time update event types
/**
 * @typedef {'inventory_updated'|'inventory_created'|'inventory_deleted'|'transaction_created'|'low_stock_alert'|'upload_completed'|'upload_failed'} UpdateEventType
 */

// Update event interface
/**
 * @typedef {Object} UpdateEvent
 * @property {string} id - Event ID
 * @property {UpdateEventType} type - Event type
 * @property {string} timestamp - Event timestamp
 * @property {*} data - Event data
 * @property {string} [userId] - User ID
 * @property {string} [companyId] - Company ID
 */

// Subscription callback type
/**
 * @typedef {function(UpdateEvent): void} UpdateCallback
 */

// Subscription interface
/**
 * @typedef {Object} Subscription
 * @property {string} id - Subscription ID
 * @property {UpdateEventType[]} eventTypes - Event types to listen for
 * @property {UpdateCallback} callback - Callback function
 * @property {string} [userId] - User ID filter
 * @property {string} [companyId] - Company ID filter
 * @property {boolean} active - Whether subscription is active
 */

// Real-time updates service
export class RealTimeUpdatesService {
  static subscriptions = new Map();
  static eventQueue = [];
  static isConnected = false;
  static reconnectAttempts = 0;
  static maxReconnectAttempts = 5;
  static reconnectDelay = 1000; // Start with 1 second
  
  // Initialize real-time connection
  static async initialize() {
    try {
      // In a real application, this would establish WebSocket connection
      // For now, we'll simulate with polling
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Start polling for updates (simulate real-time)
      this.startPolling();
      
      console.log('Real-time updates service initialized');
    } catch (error) {
      console.error('Failed to initialize real-time updates:', error);
      this.handleConnectionError();
    }
  }
  
  // Subscribe to real-time updates
  static subscribe(eventTypes, callback, options = {}) {
    const subscriptionId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription = {
      id: subscriptionId,
      eventTypes,
      callback,
      userId: options.userId,
      companyId: options.companyId,
      active: true
    };
    
    this.subscriptions.set(subscriptionId, subscription);
    
    // If not connected, try to initialize
    if (!this.isConnected) {
      this.initialize();
    }
    
    return subscriptionId;
  }
  
  // Unsubscribe from updates
  static unsubscribe(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.active = false;
      this.subscriptions.delete(subscriptionId);
    }
  }
  
  // Publish an update event
  static publishEvent(event) {
    const updateEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    
    // Add to event queue
    this.eventQueue.push(updateEvent);
    
    // Process immediately
    this.processEvent(updateEvent);
    
    // Keep only last 100 events in queue
    if (this.eventQueue.length > 100) {
      this.eventQueue = this.eventQueue.slice(-100);
    }
  }
  
  // Process and distribute event to subscribers
  static processEvent(event) {
    this.subscriptions.forEach(subscription => {
      if (!subscription.active) return;
      
      // Check if subscription is interested in this event type
      if (!subscription.eventTypes.includes(event.type)) return;
      
      // Check user-specific filtering
      if (subscription.userId && event.userId && subscription.userId !== event.userId) return;
      
      // Check company-specific filtering
      if (subscription.companyId && event.companyId && subscription.companyId !== event.companyId) return;
      
      // Call the callback
      try {
        subscription.callback(event);
      } catch (error) {
        console.error('Error in subscription callback:', error);
      }
    });
  }
  
  // Start polling for updates (simulates WebSocket)
  static startPolling() {
    // Simulate receiving updates every 5 seconds
    setInterval(() => {
      if (this.isConnected) {
        this.simulateRandomUpdates();
      }
    }, 5000);
  }
  
  // Simulate random updates for demo purposes
  static simulateRandomUpdates() {
    const random = Math.random();
    
    if (random < 0.1) { // 10% chance of low stock alert
      this.publishEvent({
        type: 'low_stock_alert',
        data: {
          itemId: 'inv-001',
          itemName: 'Office Chairs',
          currentQuantity: 8,
          minStockLevel: 10,
          companyName: 'Acme Corp'
        },
        companyId: '1'
      });
    } else if (random < 0.2) { // 10% chance of inventory update
      this.publishEvent({
        type: 'inventory_updated',
        data: {
          itemId: 'inv-002',
          itemName: 'Laptops',
          oldQuantity: 15,
          newQuantity: 12,
          companyName: 'Acme Corp'
        },
        companyId: '1',
        userId: 'manager@enterprise.com'
      });
    }
  }
  
  // Handle connection errors
  static handleConnectionError() {
    this.isConnected = false;
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.initialize();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached. Real-time updates disabled.');
    }
  }
  
  // Get connection status
  static getConnectionStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      activeSubscriptions: Array.from(this.subscriptions.values()).filter(s => s.active).length
    };
  }
  
  // Get recent events
  static getRecentEvents(limit = 10) {
    return this.eventQueue.slice(-limit).reverse();
  }
  
  // Clear event queue
  static clearEventQueue() {
    this.eventQueue = [];
  }
  
  // Disconnect and cleanup
  static disconnect() {
    this.isConnected = false;
    this.subscriptions.clear();
    this.eventQueue = [];
    this.reconnectAttempts = 0;
  }
}

// React hook for real-time updates
export const useRealTimeUpdates = (eventTypes, callback, options = {}) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState(null);
  
  React.useEffect(() => {
    if (options.enabled === false) return;
    
    // Wrapper callback to update state
    const wrappedCallback = (event) => {
      setLastEvent(event);
      callback(event);
    };
    
    // Subscribe to updates
    const subscriptionId = RealTimeUpdatesService.subscribe(
      eventTypes,
      wrappedCallback,
      {
        userId: options.userId,
        companyId: options.companyId
      }
    );
    
    // Check connection status
    const checkConnection = () => {
      const status = RealTimeUpdatesService.getConnectionStatus();
      setIsConnected(status.connected);
    };
    
    checkConnection();
    const connectionInterval = setInterval(checkConnection, 1000);
    
    // Cleanup
    return () => {
      RealTimeUpdatesService.unsubscribe(subscriptionId);
      clearInterval(connectionInterval);
    };
  }, [eventTypes, callback, options.userId, options.companyId, options.enabled]);
  
  return {
    isConnected,
    lastEvent
  };
};

// Helper functions for publishing common events
export const publishInventoryUpdate = (item, userId) => {
  RealTimeUpdatesService.publishEvent({
    type: 'inventory_updated',
    data: { item },
    userId,
    companyId: item.companyId
  });
};

export const publishLowStockAlert = (item) => {
  RealTimeUpdatesService.publishEvent({
    type: 'low_stock_alert',
    data: {
      itemId: item.id,
      itemName: item.name,
      currentQuantity: item.currentQuantity,
      minStockLevel: item.minStockLevel,
      companyName: item.companyName
    },
    companyId: item.companyId
  });
};

export default RealTimeUpdatesService;
