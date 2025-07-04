import React, { useContext, useEffect, useState } from 'react';
import { Building2Icon, ChevronDownIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import { AuthContext } from '../../App.jsx';
import companyService from '../../services/companyService.js';

const CompanyFilter = ({
  selectedCompany,
  onCompanyChange,
  companies: providedCompanies,
  className = '',
  showAllOption = true,
  disabled = false
}) => {
  const { user, userRole } = useContext(AuthContext);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        if (providedCompanies) {
          // Use provided companies if available
          setAvailableCompanies(providedCompanies);
        } else {
          // Load companies from API
          const companies = await companyService.getCompanies();
          setAllCompanies(companies);

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

          // Auto-select first company if none selected and no "all" option
          if (!selectedCompany && filteredCompanies.length > 0 && !showAllOption) {
            onCompanyChange(filteredCompanies[0].id.toString());
          }
        }
      } catch (error) {
        console.error('Failed to load companies:', error);
        setAvailableCompanies([]);
      }
    };

    if (user) {
      loadCompanies();
    }
  }, [user, userRole, providedCompanies, selectedCompany, showAllOption, onCompanyChange]);

  const handleCompanyChange = (event) => {
    onCompanyChange(event.target.value);
  };

  const getSelectedCompanyName = () => {
    if (selectedCompany === 'all') {
      return 'All Companies';
    }
    
    const company = availableCompanies.find(c => c.id === selectedCompany);
    return company ? company.name : 'Select Company';
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <select
          value={selectedCompany}
          onChange={handleCompanyChange}
          disabled={disabled}
          className={`
            appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10
            text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary 
            focus:border-primary disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          `}
        >
          {showAllOption && (
            <option value="all">All Companies</option>
          )}
          {availableCompanies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        </div>
        
        {/* Company icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Building2Icon className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

CompanyFilter.propTypes = {
  selectedCompany: PropTypes.string.isRequired,
  onCompanyChange: PropTypes.func.isRequired,
  companies: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })),
  className: PropTypes.string,
  showAllOption: PropTypes.bool,
  disabled: PropTypes.bool
};

// Utility hook to get user companies based on role
export const useUserCompanies = () => {
  const { userRole } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {

    const allCompanies = [
      { id: '1', name: 'Acme Corp' },
      { id: '2', name: 'TechStart Inc' },
      { id: '3', name: 'Global Ventures' },
      { id: '4', name: 'Future Fund' },
      { id: '5', name: 'Capital Partners' }
    ];

    const partnerAssignedCompanies = [
      { id: '1', name: 'Acme Corp' },
      { id: '2', name: 'TechStart Inc' }
    ];

    switch (userRole) {
      case 'superadmin':
      case 'manager':
        setCompanies(allCompanies);
        break;
      case 'partner':
        setCompanies(partnerAssignedCompanies);
        break;
      default:
        setCompanies([]);
    }
  }, [userRole]);

  return companies;
};

// Utility function to check if user can access a company
export const canAccessCompany = (companyId, userRole) => {
  if (userRole === 'superadmin' || userRole === 'manager') {
    return true;
  }
  
  if (userRole === 'partner') {
    // Partner can only access assigned companies
    const partnerAssignedCompanyIds = ['1', '2']; // In real app, this would come from user profile
    return partnerAssignedCompanyIds.includes(companyId);
  }
  
  return false;
};

// Utility function to get default company for user
export const getDefaultCompany = (userRole) => {
  switch (userRole) {
    case 'superadmin':
    case 'manager':
      return 'all'; // Show all companies by default
    case 'partner':
      return '1'; // Default to first assigned company
    default:
      return '';
  }
};

export default CompanyFilter;
