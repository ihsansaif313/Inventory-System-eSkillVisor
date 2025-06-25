import React from 'react';
import { UserPlusIcon, UsersIcon, Building2Icon, ClockIcon, CheckCircleIcon, BarChart3Icon, TrendingUpIcon, ArrowRightIcon } from 'lucide-react';
import ApprovalHeatmap from '../../components/dashboard/superadmin/ApprovalHeatmap';
import LiveStats from '../../components/dashboard/superadmin/LiveStats';
import ActivityStream from '../../components/dashboard/superadmin/ActivityStream';
const SuperadminDashboard = () => {
  return <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">
          Omniview Dashboard
        </h1>
        <p className="text-neutral-dark text-opacity-70">
          Complete overview of platform performance and activity
        </p>
      </div>
      {/* Dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Live Stats Panel */}
        <div className="lg:col-span-2">
          <LiveStats />
        </div>
        {/* Quick Actions */}
        <div className="data-card">
          <h3 className="text-lg font-bold text-neutral-dark mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="btn-primary w-full flex items-center justify-center">
              <UserPlusIcon size={18} className="mr-2" />
              Create New User
            </button>
            <button className="btn-secondary w-full flex items-center justify-center">
              <Building2Icon size={18} className="mr-2" />
              Register Company
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-bold text-neutral-dark mb-3">
              Pending Approvals
            </h4>
            <div className="space-y-2">
              <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    Capital Partners
                  </p>
                  <p className="text-xs text-orange-700">
                    Awaiting your approval
                  </p>
                </div>
                <button className="text-xs font-medium text-orange-800 hover:text-orange-900">
                  <ArrowRightIcon size={16} />
                </button>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    TechStart Inc
                  </p>
                  <p className="text-xs text-yellow-700">
                    Documents pending review
                  </p>
                </div>
                <button className="text-xs font-medium text-yellow-800 hover:text-yellow-900">
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Performance Summary */}
        <div className="data-card">
          <h3 className="text-lg font-bold text-neutral-dark mb-4">
            Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircleIcon size={20} />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-neutral-dark">
                  Approval Rate
                </p>
                <p className="text-lg font-bold text-green-600">92%</p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
                  <div className="h-1.5 bg-green-500 rounded-full" style={{
                  width: '92%'
                }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <ClockIcon size={20} />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-neutral-dark">
                  Avg. Response Time
                </p>
                <p className="text-lg font-bold text-blue-600">1.2 days</p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
                  <div className="h-1.5 bg-blue-500 rounded-full" style={{
                  width: '85%'
                }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <TrendingUpIcon size={20} />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-neutral-dark">
                  Growth Rate
                </p>
                <p className="text-lg font-bold text-purple-600">+24%</p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
                  <div className="h-1.5 bg-purple-500 rounded-full" style={{
                  width: '24%'
                }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-neutral-dark">
                Monthly Target
              </h4>
              <span className="text-sm font-bold text-green-600">78%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
              <div className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full" style={{
              width: '78%'
            }}></div>
            </div>
          </div>
        </div>
        {/* Approval Heatmap */}
        <div className="lg:col-span-2 data-card">
          <h3 className="text-lg font-bold text-neutral-dark mb-4">
            Approval Urgency Heatmap
          </h3>
          <ApprovalHeatmap />
        </div>
        {/* Activity Stream */}
        <div className="lg:col-span-2 data-card">
          <h3 className="text-lg font-bold text-neutral-dark mb-4">
            Activity Stream
          </h3>
          <ActivityStream />
        </div>
      </div>
    </div>;
};
export default SuperadminDashboard;