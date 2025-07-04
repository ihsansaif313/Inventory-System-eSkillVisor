import React, { useState } from 'react';
import { EyeIcon, PackageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PartnerCompanyList = () => {
  const navigate = useNavigate();
  const [companies] = useState([
    { id: '1', name: 'Acme Corp', inventoryItems: 3, totalValue: 17899.67, lastUpdate: '2024-01-15' },
    { id: '2', name: 'TechStart Inc', inventoryItems: 2, totalValue: 2949.83, lastUpdate: '2024-01-13' }
  ]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Companies</h1>
        <p className="text-gray-600">Companies assigned to your portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Inventory Items</span>
                <div className="flex items-center">
                  <PackageIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">{company.inventoryItems}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Value</span>
                <span className="text-sm font-medium text-gray-900">${company.totalValue.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-500">{new Date(company.lastUpdate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/partner/company/${company.id}`)}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerCompanyList;
