import React, { useState, useEffect, useContext } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { AuthContext } from '../../App.jsx';
import companyService from '../../services/companyService.js';

const CompanyManagement = () => {
  const { user } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const companiesData = await companyService.getCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Failed to load companies:', error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadCompanies();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
          <p className="text-gray-600">Manage companies and their details</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
            <p className="text-gray-600">Manage companies and their details</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Company
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {companies.map((company) => (
            <div key={company.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>ID: {company.id}</p>
                <p>Inventory Items: 3</p>
                <p>Assigned Partners: 1</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="text-primary hover:text-primary-dark text-sm">View Details</button>
                <button className="text-gray-600 hover:text-gray-900 text-sm">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement;
