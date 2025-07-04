import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PackageIcon, DollarSignIcon, TrendingUpIcon } from 'lucide-react';
import { InventoryTable } from '../../components/inventory/index.js';
import { AuthContext } from '../../App.jsx';
import companyService from '../../services/companyService.js';
import inventoryService from '../../services/inventoryService.js';

const PartnerCompanyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [company, setCompany] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);

        // Load company details
        const companyData = await companyService.getCompany(id);
        setCompany(companyData);

        // Load inventory items for this company
        const inventoryItems = await inventoryService.getInventoryItems({ company_id: id });
        setItems(inventoryItems);

      } catch (error) {
        console.error('Failed to load company data:', error);
        setCompany(null);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      loadCompanyData();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Company not found</p>
        </div>
      </div>
    );
  }

  const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = items.filter(item => item.currentQuantity <= item.minStockLevel).length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate('/partner/companies')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Companies
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600">Company inventory and details</p>
          </div>
          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{items.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <PackageIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <DollarSignIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-semibold text-gray-900">{lowStockItems}</p>
            </div>
            <div className="p-3 rounded-full bg-red-50 text-red-600">
              <TrendingUpIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable
        items={items}
        showCompanyColumn={false}
        showActions={false}
      />
    </div>
  );
};

export default PartnerCompanyView;
