// Audit configuration
/**
 * @typedef {Object} AuditConfig
 * @property {boolean} [enableAudit] - Whether audit is enabled
 * @property {number} [retentionDays] - Number of days to retain audit entries
 * @property {boolean} [trackUserAgent] - Whether to track user agent
 * @property {boolean} [trackIPAddress] - Whether to track IP address
 * @property {boolean} [compressOldEntries] - Whether to compress old entries
 * @property {number} [maxEntriesPerEntity] - Maximum entries per entity
 */

// Audit query filters
/**
 * @typedef {Object} AuditQuery
 * @property {'inventory'|'purchase'|'sale'|'upload'} [entityType] - Type of entity
 * @property {string} [entityId] - Entity ID
 * @property {'create'|'update'|'delete'|'upload'|'process'} [action] - Action type
 * @property {string} [performedBy] - User who performed action
 * @property {Object} [dateRange] - Date range filter
 * @property {string} dateRange.start - Start date
 * @property {string} dateRange.end - End date
 * @property {number} [limit] - Limit number of results
 * @property {number} [offset] - Offset for pagination
 */

// Default configuration
const DEFAULT_CONFIG = {
  enableAudit: true,
  retentionDays: 365, // 1 year
  trackUserAgent: true,
  trackIPAddress: false, // Privacy consideration
  compressOldEntries: false,
  maxEntriesPerEntity: 1000
};

// Mock audit database (in real app, this would be a proper database)
let AUDIT_DATABASE = [];

// Audit trail service
export class AuditTrailService {
  static config = DEFAULT_CONFIG;
  
  // Set audit configuration
  static setConfig(config) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  // Log an audit entry
  static async logEntry(entry) {
    if (!this.config.enableAudit) {
      return '';
    }
    
    const auditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...entry,
      performedAt: new Date().toISOString(),
      userAgent: this.config.trackUserAgent ? this.getUserAgent() : undefined,
      ipAddress: this.config.trackIPAddress ? this.getIPAddress() : undefined
    };
    
    AUDIT_DATABASE.push(auditEntry);
    
    // Clean up old entries if needed
    await this.cleanupOldEntries();
    
    // Limit entries per entity if configured
    if (this.config.maxEntriesPerEntity) {
      await this.limitEntriesPerEntity(entry.entityId, entry.entityType);
    }
    
    return auditEntry.id;
  }
  
  // Log inventory item creation
  static async logInventoryCreation(itemId, itemData, performedBy, description) {
    return this.logEntry({
      entityType: 'inventory',
      entityId: itemId,
      action: 'create',
      performedBy,
      description: description || 'Inventory item created',
      changes: {
        created: { old: null, new: itemData }
      }
    });
  }
  
  // Log inventory item update
  static async logInventoryUpdate(itemId, oldData, newData, performedBy, description) {
    const changes = {};
    
    // Compare old and new data to identify changes
    Object.keys(newData).forEach(key => {
      if (oldData[key] !== newData[key]) {
        changes[key] = { old: oldData[key], new: newData[key] };
      }
    });
    
    return this.logEntry({
      entityType: 'inventory',
      entityId: itemId,
      action: 'update',
      performedBy,
      description: description || 'Inventory item updated',
      changes
    });
  }
  
  // Query audit entries
  static async queryEntries(query = {}) {
    let results = [...AUDIT_DATABASE];
    
    // Apply filters
    if (query.entityType) {
      results = results.filter(entry => entry.entityType === query.entityType);
    }
    
    if (query.entityId) {
      results = results.filter(entry => entry.entityId === query.entityId);
    }
    
    if (query.action) {
      results = results.filter(entry => entry.action === query.action);
    }
    
    if (query.performedBy) {
      results = results.filter(entry => entry.performedBy === query.performedBy);
    }
    
    if (query.dateRange) {
      const startDate = new Date(query.dateRange.start);
      const endDate = new Date(query.dateRange.end);
      results = results.filter(entry => {
        const entryDate = new Date(entry.performedAt);
        return entryDate >= startDate && entryDate <= endDate;
      });
    }
    
    // Sort by date (newest first)
    results.sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
    
    // Apply pagination
    if (query.offset) {
      results = results.slice(query.offset);
    }
    
    if (query.limit) {
      results = results.slice(0, query.limit);
    }
    
    return results;
  }
  
  // Get audit trail for specific entity
  static async getEntityAuditTrail(entityType, entityId) {
    return this.queryEntries({ entityType, entityId });
  }
  
  // Get recent activity
  static async getRecentActivity(limit = 50) {
    return this.queryEntries({ limit });
  }
  
  // Clean up old entries based on retention policy
  static async cleanupOldEntries() {
    if (!this.config.retentionDays) return;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
    
    const initialCount = AUDIT_DATABASE.length;
    AUDIT_DATABASE = AUDIT_DATABASE.filter(entry => 
      new Date(entry.performedAt) >= cutoffDate
    );
    
    const removedCount = initialCount - AUDIT_DATABASE.length;
    if (removedCount > 0) {
      console.log(`Audit cleanup: Removed ${removedCount} old entries`);
    }
  }
  
  // Limit entries per entity
  static async limitEntriesPerEntity(entityId, entityType) {
    if (!this.config.maxEntriesPerEntity) return;
    
    const entityEntries = AUDIT_DATABASE.filter(entry => 
      entry.entityId === entityId && entry.entityType === entityType
    );
    
    if (entityEntries.length > this.config.maxEntriesPerEntity) {
      // Sort by date and keep only the most recent entries
      entityEntries.sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
      const entriesToRemove = entityEntries.slice(this.config.maxEntriesPerEntity);
      
      // Remove old entries
      entriesToRemove.forEach(entryToRemove => {
        const index = AUDIT_DATABASE.findIndex(entry => entry.id === entryToRemove.id);
        if (index !== -1) {
          AUDIT_DATABASE.splice(index, 1);
        }
      });
    }
  }
  
  // Get user agent (mock implementation)
  static getUserAgent() {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent;
    }
    return 'Unknown User Agent';
  }
  
  // Get IP address (mock implementation)
  static getIPAddress() {
    // In a real application, this would be obtained from the server
    return '127.0.0.1';
  }
  
  // Get audit database (for testing)
  static getAuditDatabase() {
    return [...AUDIT_DATABASE];
  }
  
  // Set audit database (for testing)
  static setAuditDatabase(entries) {
    AUDIT_DATABASE = [...entries];
  }
  
  // Clear audit database
  static clearAuditDatabase() {
    AUDIT_DATABASE = [];
  }
}

export default AuditTrailService;
