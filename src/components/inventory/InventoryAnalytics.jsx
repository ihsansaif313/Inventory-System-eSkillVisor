import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, PackageIcon, AlertTriangleIcon, DollarSignIcon, BuildingIcon } from 'lucide-react';
import PropTypes from 'prop-types';

const InventoryAnalytics = ({ stats, className = '' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const StatCard = ({ title, value, icon, trend, trendValue, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      red: 'bg-red-50 text-red-600',
      purple: 'bg-purple-50 text-purple-600'
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                {trend === 'up' ? (
                  <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Items"
          value={formatNumber(stats.totalItems)}
          icon={<PackageIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Total Value"
          value={formatCurrency(stats.totalValue)}
          icon={<DollarSignIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Low Stock Items"
          value={formatNumber(stats.lowStockItems)}
          icon={<AlertTriangleIcon className="h-6 w-6" />}
          color="red"
        />
        <StatCard
          title="Companies"
          value={formatNumber(stats.companiesCount)}
          icon={<BuildingIcon className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Categories</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats.topCategories.map((category, index) => {
              const percentage = (category.value / stats.totalValue) * 100;
              
              return (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.category}</p>
                      <p className="text-xs text-gray-500">{category.count} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(category.value)}</p>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Item Value</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(stats.totalValue / stats.totalItems || 0)}
              </p>
            </div>
            <DollarSignIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Rate</p>
              <p className="text-xl font-semibold text-gray-900">
                {((stats.lowStockItems / stats.totalItems) * 100 || 0).toFixed(1)}%
              </p>
            </div>
            <AlertTriangleIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Transactions</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatNumber(stats.recentTransactions)}
              </p>
            </div>
            <TrendingUpIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

InventoryAnalytics.propTypes = {
  stats: PropTypes.shape({
    totalItems: PropTypes.number.isRequired,
    totalValue: PropTypes.number.isRequired,
    lowStockItems: PropTypes.number.isRequired,
    companiesCount: PropTypes.number.isRequired,
    recentTransactions: PropTypes.number.isRequired,
    topCategories: PropTypes.arrayOf(PropTypes.shape({
      category: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired
    })).isRequired
  }).isRequired,
  className: PropTypes.string
};

export default InventoryAnalytics;
