import React, { useState, useEffect, useContext } from 'react';
import { UploadIcon, DownloadIcon, FilterIcon } from 'lucide-react';
import { InventoryTable, InventoryAnalytics, InventoryUploadModal, CompanyFilter } from '../../components/inventory/index.js';
import { AuthContext } from '../../App.jsx';
import inventoryService from '../../services/inventoryService.js';

const SuperadminInventory = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventoryStats, setInventoryStats] = useState(null);

  useEffect(() => {
    const loadInventoryData = async () => {
      try {
        setLoading(true);

        // Load inventory items
        const inventoryItems = await inventoryService.getInventoryItems();
        setItems(inventoryItems);

        // Calculate stats from items
        const stats = {
          totalItems: inventoryItems.length,
          totalValue: inventoryItems.reduce((sum, item) => sum + (item.total_value || 0), 0),
          lowStockItems: inventoryItems.filter(item => item.current_quantity <= item.min_stock_level).length,
          categories: [...new Set(inventoryItems.map(item => item.category))].length
        };
        setInventoryStats(stats);

      } catch (error) {
        console.error('Failed to load inventory data:', error);
        setItems([]);
        setInventoryStats(null);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadInventoryData();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCompany === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.companyId === selectedCompany));
    }
  }, [items, selectedCompany]);

  const handleUpload = async (file) => {
    // Simulate file upload processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          processedItems: 15,
          createdItems: 8,
          updatedItems: 7,
          errors: ['Row 3: Missing SKU for item "Test Item"']
        });
      }, 2000);
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage inventory across all companies</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Manage inventory across all companies</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload Inventory
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Analytics */}
      {inventoryStats && (
        <div className="mb-8">
          <InventoryAnalytics stats={inventoryStats} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <CompanyFilter
          selectedCompany={selectedCompany}
          onCompanyChange={setSelectedCompany}
          className="w-64"
        />
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <FilterIcon className="h-4 w-4 mr-2" />
          More Filters
        </button>
      </div>

      {/* Inventory Table */}
      <InventoryTable
        items={filteredItems}
        selectedItems={selectedItems}
        onItemSelect={setSelectedItems}
        showCompanyColumn={selectedCompany === 'all'}
      />

      {/* Upload Modal */}
      <InventoryUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default SuperadminInventory;
