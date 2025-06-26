import React from 'react';
import { UserPlusIcon, BuildingIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { mockCompanies } from '../../data/mockData.js';
import CompanyLogo from '../../components/ui/CompanyLogo.jsx';
const ManagerDashboard = () => {
  return <div className="p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-dark mb-2">
          Operations Dashboard
        </h1>
        <p className="text-neutral-dark text-opacity-70 text-sm sm:text-base">
          Manage partners and companies
        </p>
      </div>
      {/* Dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Financial Summary */}
        <div className="data-card md:col-span-1 lg:col-span-1">
          <h3 className="text-base sm:text-lg font-bold text-neutral-dark mb-4">
            Financial Summary
          </h3>
          {/* ROI Speedometer (simplified version) */}
          <div className="flex justify-center mb-4">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">78%</div>
                  <div className="text-sm text-neutral-dark">ROI</div>
                </div>
              </div>
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="10" strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - 0.78)} strokeLinecap="round" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1A56DB" />
                    <stop offset="100%" stopColor="#FF6B35" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-neutral-dark">
                  Total Investment
                </h4>
                <p className="text-xl font-bold text-neutral-dark">$1.2M</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-dark">
                  Revenue
                </h4>
                <p className="text-xl font-bold text-green-600">$2.14M</p>
              </div>
            </div>
          </div>
        </div>
        {/* Action Center */}
        <div className="data-card">
          <h3 className="text-lg font-bold text-neutral-dark mb-4">
            Action Center
          </h3>
          <div className="space-y-3">
            <button className="btn-primary w-full flex items-center justify-center">
              <UserPlusIcon size={18} className="mr-2" />
              New Partner
            </button>
            <button className="btn-secondary w-full flex items-center justify-center">
              <BuildingIcon size={18} className="mr-2" />
              Register Company
            </button>
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-bold text-neutral-dark mb-3">
              Pending Tasks
            </h4>
            <div className="space-y-2">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-yellow-800">
                    Approval Request
                  </p>
                  <span className="text-xs text-yellow-800">2 days ago</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  TechStart Inc. requires approval
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-blue-800">
                    Document Alert
                  </p>
                  <span className="text-xs text-blue-800">1 day ago</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Financial documents uploaded by Capital Partners
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Partner Leaderboard */}
        <div className="data-card">
          <h3 className="text-lg font-bold text-neutral-dark mb-4">
            Partner Leaderboard
          </h3>
          <div className="space-y-4">
            {[{
            name: 'Acme Corp',
            profit: 32,
            growth: 12
          }, {
            name: 'TechStart Inc',
            profit: 28,
            growth: 8
          }, {
            name: 'Global Ventures',
            profit: 25,
            growth: 15
          }, {
            name: 'Future Fund',
            profit: 20,
            growth: 5
          }, {
            name: 'Capital Partners',
            profit: 18,
            growth: -3
          }].map((partner, index) => <div key={index} className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">
                  {index + 1}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-neutral-dark">
                      {partner.name}
                    </p>
                    <p className="text-sm font-bold text-neutral-dark">
                      ${partner.profit}k
                    </p>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="h-1 bg-gray-200 rounded-full flex-1" style={{
                  width: '100%'
                }}>
                      <div className="h-1 bg-primary rounded-full" style={{
                    width: `${partner.profit / 32 * 100}%`
                  }}></div>
                    </div>
                    <span className={`ml-2 text-xs font-medium ${partner.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {partner.growth >= 0 ? '+' : ''}
                      {partner.growth}%
                    </span>
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Recent Companies */}
        <div className="data-card lg:col-span-3">
          <h3 className="text-base sm:text-lg font-bold text-neutral-dark mb-4">
            Recent Companies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCompanies.slice(0, 6).map(company => (
              <div key={company.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <CompanyLogo
                    logoUrl={company.logoUrl}
                    companyName={company.name}
                    size="sm"
                    showInitials={true}
                  />
                  <div className="ml-3 flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {company.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {company.industry}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      company.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {company.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    {company.profit > 0 ? (
                      <TrendingUpIcon size={12} className="text-green-500 mr-1" />
                    ) : (
                      <TrendingDownIcon size={12} className="text-red-500 mr-1" />
                    )}
                    {company.roi}% ROI
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>;
};
export default ManagerDashboard;