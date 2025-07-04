// Company data structure for matching
/**
 * @typedef {Object} Company
 * @property {string} id - Company ID
 * @property {string} name - Company name
 * @property {string[]} [aliases] - Alternative names
 * @property {string[]} [identifiers] - Company identifiers
 * @property {string[]} [keywords] - Keywords for matching
 */

/**
 * @typedef {Object} MatchingConfig
 * @property {number} [minConfidence] - Minimum confidence threshold
 * @property {number} [exactMatchBonus] - Bonus for exact matches
 * @property {number} [aliasMatchBonus] - Bonus for alias matches
 * @property {number} [keywordMatchBonus] - Bonus for keyword matches
 * @property {number} [lengthPenalty] - Penalty for length differences
 * @property {boolean} [caseSensitive] - Whether matching is case sensitive
 */

// Default matching configuration
const DEFAULT_CONFIG = {
  minConfidence: 0.6,
  exactMatchBonus: 1.0,
  aliasMatchBonus: 0.9,
  keywordMatchBonus: 0.3,
  lengthPenalty: 0.1,
  caseSensitive: false
};

import companyService from './companyService.js';

// Company database cache
let COMPANY_DATABASE = [];

// Load companies from API
async function loadCompanies() {
  try {
    const companies = await companyService.getCompanies();
    COMPANY_DATABASE = companies.map(company => ({
      id: company.id.toString(),
      name: company.name,
      aliases: [company.name],
      identifiers: [company.id.toString()],
      keywords: company.name.toLowerCase().split(' ')
    }));
  } catch (error) {
    console.error('Failed to load companies:', error);
    COMPANY_DATABASE = [];
  }
}

// String similarity algorithms
class StringSimilarity {
  // Levenshtein distance
  static levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  // Similarity ratio based on Levenshtein distance
  static similarity(str1, str2) {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1.0;
    
    const distance = this.levenshteinDistance(str1, str2);
    return (maxLength - distance) / maxLength;
  }
  
  // Jaro-Winkler similarity
  static jaroWinkler(str1, str2) {
    const jaro = this.jaro(str1, str2);
    
    // Calculate common prefix length (up to 4 characters)
    let prefix = 0;
    for (let i = 0; i < Math.min(str1.length, str2.length, 4); i++) {
      if (str1[i] === str2[i]) prefix++;
      else break;
    }
    
    return jaro + (0.1 * prefix * (1 - jaro));
  }
  
  static jaro(str1, str2) {
    if (str1.length === 0 && str2.length === 0) return 1.0;
    if (str1.length === 0 || str2.length === 0) return 0.0;
    
    const matchWindow = Math.floor(Math.max(str1.length, str2.length) / 2) - 1;
    const str1Matches = new Array(str1.length).fill(false);
    const str2Matches = new Array(str2.length).fill(false);
    
    let matches = 0;
    let transpositions = 0;
    
    // Find matches
    for (let i = 0; i < str1.length; i++) {
      const start = Math.max(0, i - matchWindow);
      const end = Math.min(i + matchWindow + 1, str2.length);
      
      for (let j = start; j < end; j++) {
        if (str2Matches[j] || str1[i] !== str2[j]) continue;
        str1Matches[i] = true;
        str2Matches[j] = true;
        matches++;
        break;
      }
    }
    
    if (matches === 0) return 0.0;
    
    // Count transpositions
    let k = 0;
    for (let i = 0; i < str1.length; i++) {
      if (!str1Matches[i]) continue;
      while (!str2Matches[k]) k++;
      if (str1[i] !== str2[k]) transpositions++;
      k++;
    }
    
    return (matches / str1.length + matches / str2.length + (matches - transpositions / 2) / matches) / 3;
  }
}

// Text preprocessing utilities
class TextProcessor {
  static normalize(text, caseSensitive = false) {
    let normalized = text.trim();
    
    if (!caseSensitive) {
      normalized = normalized.toLowerCase();
    }
    
    // Remove common business suffixes/prefixes
    const businessTerms = [
      'inc', 'incorporated', 'corp', 'corporation', 'ltd', 'limited', 
      'llc', 'lp', 'co', 'company', 'group', 'holdings', 'enterprises'
    ];
    
    businessTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      normalized = normalized.replace(regex, '');
    });
    
    // Remove extra whitespace and punctuation
    normalized = normalized.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    
    return normalized;
  }
  
  static extractKeywords(text) {
    const normalized = this.normalize(text);
    const words = normalized.split(/\s+/).filter(word => word.length > 2);
    return [...new Set(words)]; // Remove duplicates
  }
  
  static getAcronym(text) {
    return text
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
}

// Main company matching service
export class CompanyMatcherService {
  static companies = COMPANY_DATABASE;
  static config = DEFAULT_CONFIG;
  static initialized = false;

  // Initialize the service by loading companies from API
  static async initialize() {
    if (!this.initialized) {
      await loadCompanies();
      this.companies = COMPANY_DATABASE;
      this.initialized = true;
    }
  }

  // Set company database (for testing or different data sources)
  static setCompanyDatabase(companies) {
    this.companies = companies;
  }

  // Set matching configuration
  static setConfig(config) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Find best matching company for a given name
  static async findBestMatch(inputName) {
    if (!inputName || inputName.trim().length === 0) {
      return null;
    }

    // Ensure companies are loaded
    await this.initialize();

    const matches = await this.findAllMatches(inputName);

    if (matches.length === 0) {
      return null;
    }

    // Return the best match (highest confidence)
    const bestMatch = matches[0];

    if (bestMatch.confidence < this.config.minConfidence) {
      return null;
    }

    return bestMatch;
  }
  
  // Find all potential matches with confidence scores
  static async findAllMatches(inputName) {
    // Ensure companies are loaded
    await this.initialize();

    const normalizedInput = TextProcessor.normalize(inputName, this.config.caseSensitive);
    const inputKeywords = TextProcessor.extractKeywords(inputName);
    const inputAcronym = TextProcessor.getAcronym(inputName);

    const matches = [];

    this.companies.forEach(company => {
      const confidence = this.calculateConfidence(
        inputName,
        normalizedInput,
        inputKeywords,
        inputAcronym,
        company
      );

      if (confidence > 0) {
        matches.push({
          originalName: inputName,
          matchedCompanyId: company.id,
          matchedCompanyName: company.name,
          confidence,
          isManualMatch: false
        });
      }
    });

    // Sort by confidence (descending)
    matches.sort((a, b) => b.confidence - a.confidence);

    return matches;
  }
  
  // Calculate confidence score for a company match
  static calculateConfidence(originalName, normalizedInput, inputKeywords, inputAcronym, company) {
    let maxConfidence = 0;
    
    // Check exact match with company name
    const normalizedCompanyName = TextProcessor.normalize(company.name, this.config.caseSensitive);
    if (normalizedInput === normalizedCompanyName) {
      return this.config.exactMatchBonus;
    }
    
    // Check similarity with company name
    const nameSimilarity = StringSimilarity.jaroWinkler(normalizedInput, normalizedCompanyName);
    maxConfidence = Math.max(maxConfidence, nameSimilarity);
    
    // Check aliases
    if (company.aliases) {
      company.aliases.forEach(alias => {
        const normalizedAlias = TextProcessor.normalize(alias, this.config.caseSensitive);
        
        // Exact alias match
        if (normalizedInput === normalizedAlias) {
          maxConfidence = Math.max(maxConfidence, this.config.aliasMatchBonus);
          return;
        }
        
        // Similarity with alias
        const aliasSimilarity = StringSimilarity.jaroWinkler(normalizedInput, normalizedAlias);
        maxConfidence = Math.max(maxConfidence, aliasSimilarity * this.config.aliasMatchBonus);
      });
    }
    
    // Check identifiers
    if (company.identifiers) {
      company.identifiers.forEach(identifier => {
        if (originalName.includes(identifier) || identifier.includes(originalName)) {
          maxConfidence = Math.max(maxConfidence, 0.95);
        }
      });
    }
    
    // Check acronym match
    const companyAcronym = TextProcessor.getAcronym(company.name);
    if (inputAcronym === companyAcronym && inputAcronym.length >= 2) {
      maxConfidence = Math.max(maxConfidence, 0.8);
    }
    
    // Check keyword overlap
    if (company.keywords) {
      const keywordOverlap = this.calculateKeywordOverlap(inputKeywords, company.keywords);
      if (keywordOverlap > 0) {
        maxConfidence = Math.max(maxConfidence, keywordOverlap * this.config.keywordMatchBonus);
      }
    }
    
    // Apply length penalty for very different lengths
    const lengthDifference = Math.abs(normalizedInput.length - normalizedCompanyName.length);
    const maxLength = Math.max(normalizedInput.length, normalizedCompanyName.length);
    const lengthPenalty = (lengthDifference / maxLength) * this.config.lengthPenalty;
    
    maxConfidence = Math.max(0, maxConfidence - lengthPenalty);
    
    return Math.min(1.0, maxConfidence);
  }
  
  // Calculate keyword overlap ratio
  static calculateKeywordOverlap(keywords1, keywords2) {
    if (keywords1.length === 0 || keywords2.length === 0) {
      return 0;
    }
    
    const set1 = new Set(keywords1.map(k => k.toLowerCase()));
    const set2 = new Set(keywords2.map(k => k.toLowerCase()));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }
  
  // Batch process multiple company names
  static batchMatch(companyNames) {
    const matches = [];
    
    companyNames.forEach(name => {
      const match = this.findBestMatch(name);
      if (match) {
        matches.push(match);
      } else {
        // Create unmatched entry
        matches.push({
          originalName: name,
          matchedCompanyId: '',
          matchedCompanyName: name,
          confidence: 0,
          isManualMatch: false
        });
      }
    });
    
    return matches;
  }
  
  // Get suggestions for manual matching
  static getSuggestions(inputName, limit = 5) {
    const allMatches = this.findAllMatches(inputName);
    return allMatches.slice(0, limit);
  }
  
  // Add new company to database (for learning)
  static addCompany(company) {
    this.companies.push(company);
  }
  
  // Update company aliases based on successful matches
  static learnFromMatch(originalName, companyId) {
    const company = this.companies.find(c => c.id === companyId);
    if (company) {
      if (!company.aliases) {
        company.aliases = [];
      }
      
      const normalizedName = TextProcessor.normalize(originalName);
      const normalizedAliases = company.aliases.map(a => TextProcessor.normalize(a));
      
      if (!normalizedAliases.includes(normalizedName)) {
        company.aliases.push(originalName);
      }
    }
  }
  
  // Get matching statistics
  static getMatchingStats(companyNames) {
    const matches = this.batchMatch(companyNames);
    const matchedItems = matches.filter(m => m.confidence > this.config.minConfidence);
    const highConfidenceMatches = matches.filter(m => m.confidence > 0.8);
    
    const totalConfidence = matches.reduce((sum, m) => sum + m.confidence, 0);
    
    return {
      totalNames: companyNames.length,
      matched: matchedItems.length,
      unmatched: companyNames.length - matchedItems.length,
      averageConfidence: totalConfidence / companyNames.length,
      highConfidenceMatches: highConfidenceMatches.length
    };
  }
}

export default CompanyMatcherService;
