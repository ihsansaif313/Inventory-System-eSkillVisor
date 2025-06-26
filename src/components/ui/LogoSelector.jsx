import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { getPredefinedCompanyOptions } from '../../utils/companyLogos.js';
import CompanyLogo from './CompanyLogo.jsx';

/**
 * LogoSelector component for company logo upload/selection
 * @param {Object} props
 * @param {string} props.selectedLogo - Currently selected logo URL
 * @param {Function} props.onLogoChange - Callback when logo changes
 * @param {string} props.companyName - Company name for fallback
 */
const LogoSelector = ({ selectedLogo, onLogoChange, companyName }) => {
  const [activeTab, setActiveTab] = useState('predefined');
  const [customUrl, setCustomUrl] = useState(selectedLogo || '');
  const [dragOver, setDragOver] = useState(false);

  const predefinedOptions = getPredefinedCompanyOptions();

  const handlePredefinedSelect = (logoUrl) => {
    onLogoChange(logoUrl);
  };

  const handleCustomUrlChange = (e) => {
    const url = e.target.value;
    setCustomUrl(url);
    onLogoChange(url);
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setCustomUrl(dataUrl);
        onLogoChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const clearSelection = () => {
    setCustomUrl('');
    onLogoChange('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Company Logo
        </label>
        {selectedLogo && (
          <button
            type="button"
            onClick={clearSelection}
            className="text-sm text-red-600 hover:text-red-800 flex items-center"
          >
            <X size={14} className="mr-1" />
            Clear
          </button>
        )}
      </div>

      {/* Logo Preview */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <CompanyLogo
          logoUrl={selectedLogo}
          companyName={companyName}
          size="lg"
          showInitials={!selectedLogo}
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {selectedLogo ? 'Logo Selected' : 'No Logo Selected'}
          </p>
          <p className="text-xs text-gray-500">
            {selectedLogo ? 'Logo will be displayed across the application' : 'Choose a logo or upload a custom image'}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab('predefined')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'predefined'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Popular Logos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'upload'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Upload/URL
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'predefined' && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-64 overflow-y-auto">
          {predefinedOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handlePredefinedSelect(option.logoUrl)}
              className={`p-3 border-2 rounded-lg hover:border-primary transition-colors ${
                selectedLogo === option.logoUrl
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="relative">
                <CompanyLogo
                  logoUrl={option.logoUrl}
                  companyName={option.name}
                  size="md"
                  className="mx-auto"
                />
                {selectedLogo === option.logoUrl && (
                  <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1">
                    <Check size={12} />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2 truncate">{option.name}</p>
            </button>
          ))}
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={customUrl}
              onChange={handleCustomUrlChange}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop an image, or{' '}
                <label className="text-primary hover:text-primary-dark cursor-pointer">
                  browse
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, SVG up to 5MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoSelector;
