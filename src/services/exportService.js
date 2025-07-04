// Export format types
/**
 * @typedef {'csv'|'excel'|'pdf'} ExportFormat
 */

// Export options
/**
 * @typedef {Object} ExportOptions
 * @property {ExportFormat} format - Export format
 * @property {boolean} [includeHeaders] - Whether to include headers
 * @property {Object} [dateRange] - Date range filter
 * @property {string} dateRange.start - Start date
 * @property {string} dateRange.end - End date
 * @property {string} [companyFilter] - Company filter
 * @property {string} [categoryFilter] - Category filter
 * @property {string} [statusFilter] - Status filter
 * @property {string[]} [customFields] - Custom fields to include
 * @property {string} [fileName] - Custom file name
 */

// Export result
/**
 * @typedef {Object} ExportResult
 * @property {boolean} success - Whether export was successful
 * @property {string} fileName - Generated file name
 * @property {string} [downloadUrl] - Download URL
 * @property {string} [error] - Error message if failed
 * @property {number} recordCount - Number of records exported
 */

// Export service
export class ExportService {
  
  // Export inventory items
  static async exportInventory(items, options) {
    try {
      // Apply filters
      let filteredItems = this.applyInventoryFilters(items, options);
      
      const fileName = options.fileName || `inventory_export_${new Date().toISOString().split('T')[0]}.${options.format}`;
      
      let content;
      let mimeType;
      
      switch (options.format) {
        case 'csv':
          content = this.generateInventoryCSV(filteredItems, options);
          mimeType = 'text/csv';
          break;
        case 'excel':
          content = this.generateInventoryExcel(filteredItems, options);
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'pdf':
          content = this.generateInventoryPDF(filteredItems, options);
          mimeType = 'application/pdf';
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }
      
      // Create download
      const downloadUrl = this.createDownloadUrl(content, mimeType);
      
      return {
        success: true,
        fileName,
        downloadUrl,
        recordCount: filteredItems.length
      };
      
    } catch (error) {
      return {
        success: false,
        fileName: '',
        error: error instanceof Error ? error.message : 'Export failed',
        recordCount: 0
      };
    }
  }
  
  // Apply filters to inventory items
  static applyInventoryFilters(items, options) {
    let filtered = [...items];
    
    // Company filter
    if (options.companyFilter && options.companyFilter !== 'all') {
      filtered = filtered.filter(item => item.companyId === options.companyFilter);
    }
    
    // Category filter
    if (options.categoryFilter) {
      filtered = filtered.filter(item => item.category === options.categoryFilter);
    }
    
    // Status filter
    if (options.statusFilter) {
      filtered = filtered.filter(item => item.status === options.statusFilter);
    }
    
    // Date range filter (based on lastUpdated)
    if (options.dateRange) {
      const startDate = new Date(options.dateRange.start);
      const endDate = new Date(options.dateRange.end);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.lastUpdated);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    return filtered;
  }
  
  // Generate CSV for inventory
  static generateInventoryCSV(items, options) {
    const headers = [
      'ID', 'Name', 'SKU', 'Category', 'Current Quantity', 'Min Stock Level', 
      'Max Stock Level', 'Unit Price', 'Total Value', 'Company', 'Status', 
      'Last Updated', 'Created At', 'Updated By'
    ];
    
    const rows = items.map(item => [
      item.id,
      `"${item.name}"`,
      item.sku || '',
      item.category,
      item.currentQuantity,
      item.minStockLevel,
      item.maxStockLevel || '',
      item.unitPrice,
      item.totalValue,
      `"${item.companyName}"`,
      item.status,
      item.lastUpdated,
      item.createdAt,
      item.updatedBy
    ]);
    
    const csvContent = [
      ...(options.includeHeaders !== false ? [headers.join(',')] : []),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  }
  
  // Generate Excel for inventory (simplified - in real app would use a library like xlsx)
  static generateInventoryExcel(items, options) {
    // This is a simplified implementation
    // In a real application, you would use a library like 'xlsx' or 'exceljs'
    return this.generateInventoryCSV(items, options);
  }
  
  // Generate PDF for inventory (simplified - in real app would use a library like jsPDF)
  static generateInventoryPDF(items, options) {
    // This is a simplified implementation
    // In a real application, you would use a library like 'jsPDF' or 'pdfkit'
    
    const title = 'Inventory Report';
    const date = new Date().toLocaleDateString();
    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
    
    let pdfContent = `
${title}
Generated: ${date}
Total Items: ${items.length}
Total Value: $${totalValue.toFixed(2)}

Items:
${items.map(item => `
- ${item.name} (${item.sku})
  Category: ${item.category}
  Quantity: ${item.currentQuantity}
  Unit Price: $${item.unitPrice.toFixed(2)}
  Total Value: $${item.totalValue.toFixed(2)}
  Company: ${item.companyName}
  Status: ${item.status}
`).join('\n')}
    `;
    
    return pdfContent;
  }
  
  // Create download URL
  static createDownloadUrl(content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    return URL.createObjectURL(blob);
  }
  
  // Trigger download
  static triggerDownload(downloadUrl, fileName) {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL after download
    setTimeout(() => {
      URL.revokeObjectURL(downloadUrl);
    }, 1000);
  }
  
  // Get available export formats
  static getAvailableFormats() {
    return [
      {
        value: 'csv',
        label: 'CSV',
        description: 'Comma-separated values, compatible with Excel and other spreadsheet applications'
      },
      {
        value: 'excel',
        label: 'Excel',
        description: 'Microsoft Excel format with formatting and formulas'
      },
      {
        value: 'pdf',
        label: 'PDF',
        description: 'Portable Document Format for reports and printing'
      }
    ];
  }
  
  // Validate export options
  static validateExportOptions(options) {
    const errors = [];
    
    if (!options.format) {
      errors.push('Export format is required');
    }
    
    if (options.format && !['csv', 'excel', 'pdf'].includes(options.format)) {
      errors.push('Invalid export format');
    }
    
    if (options.dateRange) {
      const startDate = new Date(options.dateRange.start);
      const endDate = new Date(options.dateRange.end);
      
      if (isNaN(startDate.getTime())) {
        errors.push('Invalid start date');
      }
      
      if (isNaN(endDate.getTime())) {
        errors.push('Invalid end date');
      }
      
      if (startDate > endDate) {
        errors.push('Start date must be before end date');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Get export preview
  static getExportPreview(items, options) {
    const filteredItems = this.applyInventoryFilters(items, options);
    const columns = [
      'ID', 'Name', 'SKU', 'Category', 'Current Quantity', 'Min Stock Level',
      'Unit Price', 'Total Value', 'Company', 'Status', 'Last Updated'
    ];
    
    const sampleData = filteredItems.slice(0, 5).map(item => ({
      ID: item.id,
      Name: item.name,
      SKU: item.sku,
      Category: item.category,
      'Current Quantity': item.currentQuantity,
      'Min Stock Level': item.minStockLevel,
      'Unit Price': `$${item.unitPrice.toFixed(2)}`,
      'Total Value': `$${item.totalValue.toFixed(2)}`,
      Company: item.companyName,
      Status: item.status,
      'Last Updated': new Date(item.lastUpdated).toLocaleDateString()
    }));
    
    // Estimate file size (rough calculation)
    const avgRowSize = 200; // bytes per row
    const estimatedBytes = filteredItems.length * avgRowSize;
    const estimatedFileSize = this.formatFileSize(estimatedBytes);
    
    return {
      recordCount: filteredItems.length,
      estimatedFileSize,
      columns,
      sampleData
    };
  }
  
  // Format file size
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default ExportService;
