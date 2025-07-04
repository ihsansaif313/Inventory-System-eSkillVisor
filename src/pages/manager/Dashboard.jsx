import React, { useState, useEffect, useContext } from 'react';
import { UsersIcon, Building2Icon, PackageIcon, TrendingUpIcon } from 'lucide-react';
import { AuthContext } from '../../App.jsx';
import inventoryService from '../../services/inventoryService.js';
import userService from '../../services/userService.js';
import companyService from '../../services/companyService.js';

const ManagerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPartners: 0,
    managedCompanies: 0,
    totalInventoryValue: 0,
    recentUploads: 0
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
            totalPartners: dashboardData.users?.partners || 0,
            managedCompanies: dashboardData.companies?.total_companies || 0,
            totalInventoryValue: dashboardData.inventory?.total_value || 0,
            recentUploads: dashboardData.recent_uploads || 0
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Set default values on error
        setStats({
          totalPartners: 0,
          managedCompanies: 0,
          totalInventoryValue: 0,
          recentUploads: 0
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
      orange: 'bg-orange-50 text-orange-600'
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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600">Manage partners and oversee company operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Partners"
          value={stats.totalPartners}
          icon={<UsersIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Companies"
          value={stats.managedCompanies}
          icon={<Building2Icon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Inventory Value"
          value={`$${stats.totalInventoryValue.toLocaleString()}`}
          icon={<PackageIcon className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Recent Uploads"
          value={stats.recentUploads}
          icon={<TrendingUpIcon className="h-6 w-6" />}
          color="orange"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Partner Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Inventory uploaded</p>
                <p className="text-xs text-gray-500">partner@enterprise.com - Acme Corp - 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Company data updated</p>
                <p className="text-xs text-gray-500">TechStart Inc - 3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
