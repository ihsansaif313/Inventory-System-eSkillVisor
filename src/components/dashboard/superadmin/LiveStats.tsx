import React from 'react';
import { UsersIcon, BuildingIcon, ClockIcon, TrendingUpIcon } from 'lucide-react';
const LiveStats = () => {
  return <div className="data-card">
      <h3 className="text-lg font-bold text-neutral-dark mb-4">
        Live Platform Stats
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <UsersIcon size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-dark">Managers</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-neutral-dark">24</p>
                <p className="ml-2 text-xs text-green-600 flex items-center">
                  <TrendingUpIcon size={12} className="mr-1" />
                  +2 this month
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1 bg-gray-100 rounded-full">
            <div className="h-1 bg-blue-500 rounded-full" style={{
            width: '75%'
          }}></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <UsersIcon size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-dark">Partners</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-neutral-dark">142</p>
                <p className="ml-2 text-xs text-green-600 flex items-center">
                  <TrendingUpIcon size={12} className="mr-1" />
                  +12 this month
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1 bg-gray-100 rounded-full">
            <div className="h-1 bg-orange-500 rounded-full" style={{
            width: '85%'
          }}></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <ClockIcon size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-dark">Pending</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-neutral-dark">8</p>
                <p className="ml-2 text-xs text-red-600">3 urgent</p>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1 bg-gray-100 rounded-full">
            <div className="h-1 bg-yellow-500 rounded-full" style={{
            width: '30%'
          }}></div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-neutral-dark">
              Total Companies
            </h4>
            <p className="text-xl font-bold text-neutral-dark">187</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-dark">
              Active Users
            </h4>
            <p className="text-xl font-bold text-neutral-dark">156</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-dark">
              Approval Rate
            </h4>
            <p className="text-xl font-bold text-green-600">92%</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="h-2 bg-gray-100 rounded-full">
            <div className="h-2 bg-primary rounded-full" style={{
            width: '100%'
          }}></div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div className="h-2 bg-secondary rounded-full" style={{
            width: '83%'
          }}></div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div className="h-2 bg-green-500 rounded-full" style={{
            width: '92%'
          }}></div>
          </div>
        </div>
      </div>
    </div>;
};
export default LiveStats;