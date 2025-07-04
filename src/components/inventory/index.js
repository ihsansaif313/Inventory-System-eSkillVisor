// Inventory Components Exports

export { default as CompanyFilter } from './CompanyFilter.jsx';
export { default as AdvancedCompanyFilter } from './AdvancedCompanyFilter.jsx';
export { default as FileUpload } from './FileUpload.jsx';
export { default as InventoryUploadModal } from './InventoryUploadModal.jsx';
export { default as InventoryTable } from './InventoryTable.jsx';
export { default as InventoryAnalytics } from './InventoryAnalytics.jsx';

// Re-export hooks and utilities from CompanyFilter
export { 
  useUserCompanies, 
  canAccessCompany, 
  getDefaultCompany 
} from './CompanyFilter.jsx';

// Re-export services
export { default as ExcelParserService } from '../../services/excelParser.js';
export { default as PDFParserService } from '../../services/pdfParser.js';
export { default as CompanyMatcherService } from '../../services/companyMatcher.js';
export { default as InventoryProcessorService } from '../../services/inventoryProcessor.js';
export { default as AuditTrailService } from '../../services/auditTrail.js';
export { default as ValidationService } from '../../services/validation.js';
export { default as RealTimeUpdatesService } from '../../services/realTimeUpdates.js';
export { default as ExportService } from '../../services/exportService.js';
