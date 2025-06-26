// Company logo utility functions and predefined logo URLs

// Predefined company logos using publicly available logo URLs
export const PREDEFINED_LOGOS = {
  amazon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png',
  walmart: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/200px-Walmart_logo.svg.png',
  ebay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/200px-EBay_logo.svg.png',
  microsoft: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/200px-Microsoft_logo_%282012%29.svg.png',
  google: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png',
  apple: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/200px-Apple_logo_black.svg.png',
  tesla: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/200px-Tesla_T_symbol.svg.png',
  netflix: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png',
  meta: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png',
  spotify: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/200px-Spotify_logo_without_text.svg.png',
  uber: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/200px-Uber_logo_2018.svg.png',
  airbnb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/200px-Airbnb_Logo_B%C3%A9lo.svg.png',
  twitter: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/200px-Logo_of_Twitter.svg.png',
  linkedin: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/200px-LinkedIn_logo_initials.png',
  adobe: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/200px-Adobe_Systems_logo_and_wordmark.svg.png'
};

// Default fallback logo (using a building icon as data URL)
export const DEFAULT_COMPANY_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA4MEgxNDBWMTYwSDYwVjgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNODAgMTAwSDEyMFYxNDBIODBWMTAwWiIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJNNzAgNjBIMTMwVjgwSDcwVjYwWiIgZmlsbD0iIzM3NDE1MSIvPgo8L3N2Zz4K';

/**
 * Get company logo URL with fallback
 * @param {string} logoUrl - Custom logo URL
 * @param {string} companyName - Company name for predefined logo lookup
 * @returns {string} Logo URL or default fallback
 */
export const getCompanyLogo = (logoUrl, companyName) => {
  // If custom logo URL is provided, use it
  if (logoUrl && logoUrl.trim()) {
    return logoUrl;
  }
  
  // Try to find predefined logo by company name
  if (companyName) {
    const normalizedName = companyName.toLowerCase().replace(/[^a-z]/g, '');
    const predefinedLogo = PREDEFINED_LOGOS[normalizedName];
    if (predefinedLogo) {
      return predefinedLogo;
    }
  }
  
  // Return default fallback
  return DEFAULT_COMPANY_LOGO;
};

/**
 * Get list of predefined company options for selection
 * @returns {Array} Array of company options with name and logo
 */
export const getPredefinedCompanyOptions = () => {
  return Object.entries(PREDEFINED_LOGOS).map(([key, logoUrl]) => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    logoUrl
  }));
};

/**
 * Validate if a URL is a valid image URL
 * @param {string} url - URL to validate
 * @returns {boolean} Whether the URL appears to be a valid image URL
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i;
  
  // Check for data URLs
  const dataUrl = /^data:image\//i;
  
  // Check for common image hosting domains
  const imageHosts = /(wikimedia|imgur|cloudinary|amazonaws|googleusercontent)/i;
  
  return imageExtensions.test(url) || dataUrl.test(url) || imageHosts.test(url);
};

/**
 * Generate initials from company name as fallback
 * @param {string} companyName - Company name
 * @returns {string} Company initials (max 2 characters)
 */
export const getCompanyInitials = (companyName) => {
  if (!companyName) return 'CO';
  
  const words = companyName.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
};
