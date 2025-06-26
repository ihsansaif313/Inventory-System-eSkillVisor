import React, { useState } from 'react';
import { Building2Icon } from 'lucide-react';
import { getCompanyLogo, getCompanyInitials, isValidImageUrl } from '../../utils/companyLogos.js';

/**
 * CompanyLogo component with fallback system
 * @param {Object} props
 * @param {string} props.logoUrl - Custom logo URL
 * @param {string} props.companyName - Company name
 * @param {string} props.size - Size variant: 'xs', 'sm', 'md', 'lg', 'xl'
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showFallbackIcon - Whether to show building icon as fallback
 * @param {boolean} props.showInitials - Whether to show initials as fallback
 */
const CompanyLogo = ({ 
  logoUrl, 
  companyName, 
  size = 'md', 
  className = '', 
  showFallbackIcon = true,
  showInitials = false 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Size configurations
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl'
  };

  const finalLogoUrl = getCompanyLogo(logoUrl, companyName);
  const shouldShowImage = !imageError && isValidImageUrl(finalLogoUrl);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const baseClasses = `${sizeClasses[size]} ${className} flex items-center justify-center rounded-lg overflow-hidden bg-gray-100 border border-gray-200`;

  // Show image if available and no error
  if (shouldShowImage && !imageError) {
    return (
      <div className={baseClasses}>
        {imageLoading && (
          <div className="animate-pulse bg-gray-200 w-full h-full flex items-center justify-center">
            <Building2Icon size={iconSizes[size]} className="text-gray-400" />
          </div>
        )}
        <img
          src={finalLogoUrl}
          alt={`${companyName || 'Company'} logo`}
          className={`w-full h-full object-contain ${imageLoading ? 'hidden' : 'block'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    );
  }

  // Show initials fallback
  if (showInitials && companyName) {
    const initials = getCompanyInitials(companyName);
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold ${textSizes[size]}`}>
        {initials}
      </div>
    );
  }

  // Show building icon fallback
  if (showFallbackIcon) {
    return (
      <div className={`${baseClasses} bg-gray-50`}>
        <Building2Icon size={iconSizes[size]} className="text-gray-400" />
      </div>
    );
  }

  // No fallback
  return null;
};

export default CompanyLogo;
