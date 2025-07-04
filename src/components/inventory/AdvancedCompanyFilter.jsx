import React, { useContext, useEffect, useState, useRef } from 'react';
import { Building2Icon, ChevronDownIcon, SearchIcon, CheckIcon, XIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import { AuthContext } from '../../App.jsx';
import companyService from '../../services/companyService.js';

const AdvancedCompanyFilter = ({
  selectedCompanies,
  onCompaniesChange,
  companies: providedCompanies,
  className = '',
  placeholder = 'Select companies...',
  multiSelect = false,
  disabled = false,
  maxDisplayed = 2
}) => {
  const { user, userRole } = useContext(AuthContext);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        if (providedCompanies) {
          setAvailableCompanies(providedCompanies);
        } else {
          // Load companies from API
          const companies = await companyService.getCompanies();

          // Determine companies based on user role
          let filteredCompanies = [];
          switch (userRole) {
            case 'superadmin':
            case 'manager':
              filteredCompanies = companies;
              break;
            case 'partner':
              // For partners, only show assigned companies
              filteredCompanies = user?.assigned_companies || [];
              break;
            default:
              filteredCompanies = [];
          }

          setAvailableCompanies(filteredCompanies);
        }
      } catch (error) {
        console.error('Failed to load companies:', error);
        setAvailableCompanies([]);
      }
    };

    if (user) {
      loadCompanies();
    }
  }, [user, userRole, providedCompanies]);

  useEffect(() => {
    // Filter companies based on search term
    const filtered = availableCompanies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [availableCompanies, searchTerm]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCompanyToggle = (companyId) => {
    if (multiSelect) {
      const newSelection = selectedCompanies.includes(companyId)
        ? selectedCompanies.filter(id => id !== companyId)
        : [...selectedCompanies, companyId];
      onCompaniesChange(newSelection);
    } else {
      onCompaniesChange([companyId]);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleRemoveCompany = (companyId) => {
    const newSelection = selectedCompanies.filter(id => id !== companyId);
    onCompaniesChange(newSelection);
  };

  const getDisplayText = () => {
    if (selectedCompanies.length === 0) {
      return placeholder;
    }

    const selectedNames = selectedCompanies
      .map(id => availableCompanies.find(c => c.id === id)?.name)
      .filter(Boolean);

    if (selectedNames.length <= maxDisplayed) {
      return selectedNames.join(', ');
    }

    return `${selectedNames.slice(0, maxDisplayed).join(', ')} +${selectedNames.length - maxDisplayed} more`;
  };

  const clearAll = () => {
    onCompaniesChange([]);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-2 text-left bg-white border border-gray-300 
          rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-50'}
        `}
      >
        <div className="flex items-center min-w-0 flex-1">
          <Building2Icon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
          <span className={`truncate text-sm ${selectedCompanies.length === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
            {getDisplayText()}
          </span>
        </div>
        <div className="flex items-center ml-2">
          {selectedCompanies.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="mr-2 p-1 hover:bg-gray-200 rounded"
            >
              <XIcon className="h-3 w-3 text-gray-400" />
            </button>
          )}
          <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Selected companies tags (when multiple selected) */}
      {multiSelect && selectedCompanies.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedCompanies.map(companyId => {
            const company = availableCompanies.find(c => c.id === companyId);
            if (!company) return null;
            
            return (
              <span
                key={companyId}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary bg-opacity-10 text-primary"
              >
                {company.name}
                <button
                  type="button"
                  onClick={() => handleRemoveCompany(companyId)}
                  className="ml-1 hover:bg-primary hover:bg-opacity-20 rounded"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Company list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCompanies.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm ? 'No companies found' : 'No companies available'}
              </div>
            ) : (
              filteredCompanies.map((company) => {
                const isSelected = selectedCompanies.includes(company.id);
                
                return (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => handleCompanyToggle(company.id)}
                    className={`
                      w-full flex items-center px-3 py-2 text-left text-sm hover:bg-gray-50
                      ${isSelected ? 'bg-primary bg-opacity-5 text-primary' : 'text-gray-900'}
                    `}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{company.name}</span>
                      {isSelected && (
                        <CheckIcon className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer actions */}
          {multiSelect && selectedCompanies.length > 0 && (
            <div className="p-2 border-t border-gray-200 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {selectedCompanies.length} selected
              </span>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-primary hover:text-primary-dark"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

AdvancedCompanyFilter.propTypes = {
  selectedCompanies: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCompaniesChange: PropTypes.func.isRequired,
  companies: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })),
  className: PropTypes.string,
  placeholder: PropTypes.string,
  multiSelect: PropTypes.bool,
  disabled: PropTypes.bool,
  maxDisplayed: PropTypes.number
};

export default AdvancedCompanyFilter;
