// PDF parsing configuration
/**
 * @typedef {Object} PDFParseConfig
 * @property {boolean} [extractTables] - Whether to extract tables
 * @property {Object} [pageRange] - Range of pages to parse
 * @property {number} pageRange.start - Start page
 * @property {number} pageRange.end - End page
 * @property {string[]} [textPatterns] - Array of text patterns to match
 * @property {'invoice'|'proforma'|'inventory'|'auto'} [documentType] - Type of document
 */

// Text patterns for different document types
const TEXT_PATTERNS = {
  invoice: {
    itemPattern: /(?:item|product|description)[\s:]+(.+?)(?:\n|$)/gi,
    quantityPattern: /(?:qty|quantity|units?)[\s:]+(\d+(?:\.\d+)?)/gi,
    pricePattern: /(?:price|rate|cost|amount)[\s:$]+(\d+(?:\.\d+)?)/gi,
    totalPattern: /(?:total|amount|sum)[\s:$]+(\d+(?:\.\d+)?)/gi,
    companyPattern: /(?:company|client|customer|to)[\s:]+(.+?)(?:\n|$)/gi,
    datePattern: /(?:date|invoice date)[\s:]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    invoicePattern: /(?:invoice|inv)[\s#:]+([A-Z0-9\-]+)/gi
  },
  proforma: {
    itemPattern: /(?:item|product|description|goods)[\s:]+(.+?)(?:\n|$)/gi,
    quantityPattern: /(?:qty|quantity|units?|nos?)[\s:]+(\d+(?:\.\d+)?)/gi,
    pricePattern: /(?:price|rate|cost|unit price)[\s:$]+(\d+(?:\.\d+)?)/gi,
    totalPattern: /(?:total|amount|value)[\s:$]+(\d+(?:\.\d+)?)/gi,
    companyPattern: /(?:supplier|vendor|from|company)[\s:]+(.+?)(?:\n|$)/gi,
    datePattern: /(?:date|proforma date)[\s:]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    referencePattern: /(?:proforma|ref|reference)[\s#:]+([A-Z0-9\-]+)/gi
  },
  inventory: {
    itemPattern: /(?:item|product|stock|inventory)[\s:]+(.+?)(?:\n|$)/gi,
    quantityPattern: /(?:stock|quantity|available|on hand)[\s:]+(\d+(?:\.\d+)?)/gi,
    pricePattern: /(?:price|cost|value)[\s:$]+(\d+(?:\.\d+)?)/gi,
    categoryPattern: /(?:category|type|class)[\s:]+(.+?)(?:\n|$)/gi,
    companyPattern: /(?:company|location|warehouse)[\s:]+(.+?)(?:\n|$)/gi,
    skuPattern: /(?:sku|code|id)[\s:]+([A-Z0-9\-]+)/gi
  }
};

// Mock PDF text extraction (in real implementation, would use a library like pdf-parse or pdfjs-dist)
const extractTextFromPDF = async (file) => {
  // This is a mock implementation
  // In a real application, you would use a library like 'pdf-parse' or 'pdfjs-dist'
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock PDF content - simulating extracted text
      const mockPDFContent = `
        PROFORMA INVOICE
        
        Company: TechStart Inc
        Date: 12/15/2023
        Reference: PRF-2023-001
        
        ITEMS:
        
        Item: Wireless Keyboards
        Quantity: 25
        Unit Price: $45.99
        Total: $1,149.75
        
        Item: USB Cables
        Quantity: 100
        Unit Price: $8.50
        Total: $850.00
        
        Item: Monitor Stands
        Quantity: 15
        Unit Price: $29.99
        Total: $449.85
        
        SUBTOTAL: $2,449.60
        TAX: $244.96
        TOTAL AMOUNT: $2,694.56
        
        Supplier: Office Equipment Plus
        Contact: sales@officeequipmentplus.com
        
        Terms: Net 30 days
        Delivery: 5-7 business days
      `;
      resolve(mockPDFContent);
    }, 1500);
  });
};

// Detect document type from text content
const detectDocumentType = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('proforma') || lowerText.includes('quotation') || lowerText.includes('estimate')) {
    return 'proforma';
  }
  
  if (lowerText.includes('invoice') || lowerText.includes('bill') || lowerText.includes('receipt')) {
    return 'invoice';
  }
  
  if (lowerText.includes('inventory') || lowerText.includes('stock report') || lowerText.includes('warehouse')) {
    return 'inventory';
  }
  
  return 'unknown';
};

// Extract structured data using regex patterns
const extractDataWithPatterns = (text, patterns) => {
  const extracted = {};
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    const matches = [];
    let match;
    
    // Reset regex lastIndex
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(text)) !== null) {
      if (match[1]) {
        matches.push(match[1].trim());
      }
    }
    
    extracted[key] = matches;
  });
  
  return extracted;
};

// Parse invoice/proforma data into purchase records
const parseTransactionData = (extractedData, documentType) => {
  const records = [];
  
  const items = extractedData.itemPattern || [];
  const quantities = extractedData.quantityPattern || [];
  const prices = extractedData.pricePattern || [];
  const companies = extractedData.companyPattern || [];
  const dates = extractedData.datePattern || [];
  const references = extractedData.invoicePattern || extractedData.referencePattern || [];
  
  // Get common data
  const companyName = companies[0] || 'Unknown Company';
  const date = dates[0] ? new Date(dates[0]).toISOString() : new Date().toISOString();
  const reference = references[0] || '';
  
  // Process items
  const maxItems = Math.max(items.length, quantities.length, prices.length);
  
  for (let i = 0; i < maxItems; i++) {
    const itemName = items[i]?.trim();
    const quantity = quantities[i] ? parseFloat(quantities[i]) : 0;
    const unitPrice = prices[i] ? parseFloat(prices[i]) : 0;
    
    if (itemName && quantity > 0 && unitPrice > 0) {
      const record = {
        itemName,
        quantity,
        unitPrice,
        totalAmount: quantity * unitPrice,
        companyName,
        [documentType === 'invoice' ? 'saleDate' : 'purchaseDate']: date,
        [documentType === 'invoice' ? 'invoiceNumber' : 'invoiceNumber']: reference,
        description: `Imported from ${documentType} ${reference}`,
        [documentType === 'invoice' ? 'customer' : 'supplier']: companyName
      };
      
      records.push(record);
    }
  }
  
  return records;
};

// Parse inventory data
const parseInventoryData = (extractedData) => {
  const items = [];
  
  const itemNames = extractedData.itemPattern || [];
  const quantities = extractedData.quantityPattern || [];
  const prices = extractedData.pricePattern || [];
  const categories = extractedData.categoryPattern || [];
  const companies = extractedData.companyPattern || [];
  const skus = extractedData.skuPattern || [];
  
  const companyName = companies[0] || 'Unknown Company';
  
  const maxItems = Math.max(itemNames.length, quantities.length, prices.length);
  
  for (let i = 0; i < maxItems; i++) {
    const name = itemNames[i]?.trim();
    const currentQuantity = quantities[i] ? parseFloat(quantities[i]) : 0;
    const unitPrice = prices[i] ? parseFloat(prices[i]) : 0;
    const category = categories[i] || 'Uncategorized';
    const sku = skus[i] || '';
    
    if (name && currentQuantity >= 0) {
      const item = {
        name,
        sku,
        category,
        currentQuantity,
        unitPrice,
        totalValue: currentQuantity * unitPrice,
        companyName,
        minStockLevel: 0,
        status: 'active',
        description: 'Imported from PDF inventory report'
      };
      
      items.push(item);
    }
  }
  
  return items;
};

// Clean and validate extracted text
const cleanExtractedText = (text) => {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim();
};

// Main PDF parser service
export class PDFParserService {
  static async parseInventoryFile(file, config = {}) {
    const result = {
      purchases: [],
      sales: [],
      items: [],
      companyMatches: [],
      errors: []
    };
    
    try {
      // Extract text from PDF
      const rawText = await extractTextFromPDF(file);
      const cleanText = cleanExtractedText(rawText);
      
      if (!cleanText || cleanText.length < 50) {
        result.errors.push('PDF appears to be empty or contains insufficient text');
        return result;
      }
      
      // Detect document type
      const documentType = config.documentType === 'auto' || !config.documentType 
        ? detectDocumentType(cleanText) 
        : config.documentType;
      
      if (documentType === 'unknown') {
        result.errors.push('Unable to determine document type. Please ensure the PDF contains recognizable invoice, proforma, or inventory data.');
        return result;
      }
      
      // Get appropriate patterns
      const patterns = TEXT_PATTERNS[documentType];
      
      // Extract structured data
      const extractedData = extractDataWithPatterns(cleanText, patterns);
      
      // Process based on document type
      if (documentType === 'invoice') {
        const salesRecords = parseTransactionData(extractedData, 'invoice');
        result.sales = salesRecords;
      } else if (documentType === 'proforma') {
        const purchaseRecords = parseTransactionData(extractedData, 'proforma');
        result.purchases = purchaseRecords;
      } else if (documentType === 'inventory') {
        const inventoryItems = parseInventoryData(extractedData);
        result.items = inventoryItems;
      }
      
      // Extract unique company names for matching
      const companyNames = new Set();
      [...result.items, ...result.purchases, ...result.sales].forEach(item => {
        if (item.companyName && item.companyName !== 'Unknown Company') {
          companyNames.add(item.companyName);
        }
      });
      
      // Create company matches
      companyNames.forEach(name => {
        result.companyMatches.push({
          originalName: name,
          matchedCompanyId: '', // To be filled by company matching service
          matchedCompanyName: name,
          confidence: 0.7, // Lower confidence for PDF extraction
          isManualMatch: false
        });
      });
      
      // Add warnings for low data extraction
      if (result.items.length === 0 && result.purchases.length === 0 && result.sales.length === 0) {
        result.errors.push('No valid inventory data could be extracted from the PDF. Please check the document format.');
      }
      
    } catch (error) {
      result.errors.push(`Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return result;
  }
  
  // Extract raw text for manual review
  static async extractText(file) {
    try {
      const text = await extractTextFromPDF(file);
      return { text: cleanExtractedText(text) };
    } catch (error) {
      return { 
        text: '', 
        error: `Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
  
  // Validate PDF file before processing
  static validatePDFFile(file) {
    const errors = [];
    
    // Check file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      errors.push('Invalid file type. Please upload a PDF file');
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('File size exceeds 10MB limit');
    }
    
    // Check if file is empty
    if (file.size === 0) {
      errors.push('File is empty');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Get supported document types
  static getSupportedDocumentTypes() {
    return ['invoice', 'proforma', 'inventory'];
  }
  
  // Preview extraction patterns for a document type
  static getExtractionPatterns(documentType) {
    const patterns = TEXT_PATTERNS[documentType];
    const patternStrings = {};
    
    Object.entries(patterns).forEach(([key, regex]) => {
      patternStrings[key] = regex.source;
    });
    
    return patternStrings;
  }
}

export default PDFParserService;
