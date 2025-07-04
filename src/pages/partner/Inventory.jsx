import React, { useState, useEffect, useContext } from 'react';
import { UploadIcon } from 'lucide-react';
import { InventoryTable, InventoryUploadModal, CompanyFilter } from '../../components/inventory/index.js';
import { AuthContext } from '../../App.jsx';
import inventoryService from '../../services/inventoryService.js';

const PartnerInventory = () => {
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
        // Partners only see inventory for their assigned companies
        const inventoryItems = await inventoryService.getInventoryItems();
        setItems(inventoryItems);

        // Set default company to first assigned company if available
        if (user?.assigned_companies?.length > 0) {
          setSelectedCompany(user.assigned_companies[0].id.toString());
        }
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
          processedItems: 8,
          createdItems: 3,
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
            <p className="text-gray-600">Manage inventory for your assigned companies</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload Inventory
          </button>
        </div>
      </div>

      <div className="mb-6">
        <CompanyFilter
          selectedCompany={selectedCompany}
          onCompanyChange={setSelectedCompany}
          className="w-64"
          showAllOption={true}
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

export default PartnerInventory;
