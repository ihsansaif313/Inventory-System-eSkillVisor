import React, { useState, useEffect, useContext } from 'react';
import { Building2Icon, PackageIcon, TrendingUpIcon, AlertTriangleIcon } from 'lucide-react';
import { AuthContext } from '../../App.jsx';
import inventoryService from '../../services/inventoryService.js';
import companyService from '../../services/companyService.js';

const PartnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    assignedCompanies: 0,
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Get dashboard data from API
        const dashboardData = await inventoryService.getDashboardData();

        if (dashboardData) {
          setStats({
            assignedCompanies: dashboardData.assigned_companies?.length || 0,
            totalItems: dashboardData.inventory?.total_items || 0,
            totalValue: dashboardData.inventory?.total_value || 0,
            lowStockItems: dashboardData.inventory?.low_stock_count || 0
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Set default values on error
        setStats({
          assignedCompanies: 0,
          totalItems: 0,
          totalValue: 0,
          lowStockItems: 0
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const StatCard = ({ title, value, icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      red: 'bg-red-50 text-red-600'
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Partner Portfolio</h1>
          <p className="text-gray-600">Overview of your assigned companies and their inventory</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Partner Portfolio</h1>
        <p className="text-gray-600">Overview of your assigned companies and their inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Assigned Companies"
          value={stats.assignedCompanies}
          icon={<Building2Icon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Total Items"
          value={stats.totalItems}
          icon={<PackageIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Portfolio Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          icon={<TrendingUpIcon className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockItems}
          icon={<AlertTriangleIcon className="h-6 w-6" />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Your Companies</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Acme Corp</p>
                  <p className="text-sm text-gray-500">3 inventory items</p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">TechStart Inc</p>
                  <p className="text-sm text-gray-500">2 inventory items</p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Inventory updated</p>
                  <p className="text-xs text-gray-500">Wireless Keyboards - TechStart Inc</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Low stock alert</p>
                  <p className="text-xs text-gray-500">Conference Tables - TechStart Inc</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
