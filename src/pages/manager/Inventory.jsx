import React, { useState, useEffect, useContext } from 'react';
import { UploadIcon, DownloadIcon } from 'lucide-react';
import { InventoryTable, InventoryUploadModal, CompanyFilter } from '../../components/inventory/index.js';
import { AuthContext } from '../../App.jsx';
import inventoryService from '../../services/inventoryService.js';

const ManagerInventory = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInventoryItems = async () => {
      try {
        setLoading(true);
        const inventoryItems = await inventoryService.getInventoryItems();
        setItems(inventoryItems);
      } catch (error) {
        console.error('Failed to load inventory items:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadInventoryItems();
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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          processedItems: 10,
          createdItems: 5,
          updatedItems: 5,
          errors: []
        });
      }, 2000);
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Manage inventory for your companies</p>
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

      <div className="mb-6">
        <CompanyFilter
          selectedCompany={selectedCompany}
          onCompanyChange={setSelectedCompany}
          className="w-64"
        />
      </div>

      <InventoryTable
        items={filteredItems}
        selectedItems={selectedItems}
        onItemSelect={setSelectedItems}
        showCompanyColumn={selectedCompany === 'all'}
      />

      <InventoryUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default ManagerInventory;
