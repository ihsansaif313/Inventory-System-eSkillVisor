import React from 'react';
import { BuildingIcon, FileTextIcon, DollarSignIcon } from 'lucide-react';
const PartnerDashboard = () => {
  // Mock data for company status cards
  const companies = [{
    id: 1,
    name: 'Acme Corp',
    status: 'active',
    documentCompletion: 100,
    investment: 250000,
    revenue: 320000
  }, {
    id: 2,
    name: 'TechStart Inc',
    status: 'active',
    documentCompletion: 85,
    investment: 180000,
    revenue: 210000
  }, {
    id: 3,
    name: 'Innovate Group',
    status: 'pending',
    documentCompletion: 75,
    investment: 120000,
    revenue: 0
  }];
  return <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">
          Portfolio Overview
        </h1>
        <p className="text-neutral-dark text-opacity-70">
          Monitor your investments and company performance
        </p>
      </div>
      {/* Dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Status Cards */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-neutral-dark mb-4">
            Company Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map(company => <div key={company.id} className={`rounded-lg p-5 border ${company.status === 'active' ? 'border-blue-200 shadow-sm shadow-blue-100' : 'border-orange-200 shadow-sm shadow-orange-100'}`}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg text-neutral-dark">
                    {company.name}
                  </h4>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${company.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {company.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <FileTextIcon size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-500 ml-1">
                    Document Completion
                  </span>
                  <div className="ml-auto font-medium">
                    {company.documentCompletion}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className={`h-2 rounded-full ${company.status === 'active' ? 'bg-blue-500' : 'bg-orange-500'}`} style={{
                width: `${company.documentCompletion}%`
              }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-500">Investment</p>
                    <p className="font-bold text-neutral-dark">
                      ${(company.investment / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-bold text-neutral-dark">
                      ${(company.revenue / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">ROI</p>
                    <p className={`font-bold ${company.revenue > company.investment ? 'text-green-600' : company.revenue === 0 ? 'text-gray-400' : 'text-red-600'}`}>
                      {company.revenue === 0 ? 'N/A' : `${Math.round((company.revenue / company.investment - 1) * 100)}%`}
                    </p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        {/* Net Worth Calculator */}
        <div className="data-card">
          <h3 className="text-lg font-bold text-neutral-dark mb-4">
            Net Worth
          </h3>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Total Investments</span>
              <span className="text-sm font-medium">$550,000</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Total Revenue</span>
              <span className="text-sm font-medium">$530,000</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-medium">Net Profit</span>
              <span className="text-sm font-bold text-green-600">$80,000</span>
            </div>
          </div>
          <div className="mb-6">
            <h4 className="text-sm font-medium text-neutral-dark mb-2">
              Investment Projection
            </h4>
            <div className="h-40 bg-gray-100 rounded-lg flex items-end p-2">
              {/* Simplified chart bars */}
              <div className="flex-1 flex items-end justify-around h-full">
                <div className="w-8 bg-blue-500 rounded-t-sm" style={{
                height: '60%'
              }}></div>
                <div className="w-8 bg-blue-500 rounded-t-sm" style={{
                height: '75%'
              }}></div>
                <div className="w-8 bg-blue-500 rounded-t-sm" style={{
                height: '65%'
              }}></div>
                <div className="w-8 bg-green-500 rounded-t-sm" style={{
                height: '85%'
              }}></div>
                <div className="w-8 bg-green-500 rounded-t-sm" style={{
                height: '90%'
              }}></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3</span>
              <span>Q4</span>
              <span>Q1 (Proj.)</span>
            </div>
          </div>
          <button className="btn-primary w-full flex items-center justify-center mt-4">
            <DollarSignIcon size={18} className="mr-2" />
            Run Investment Scenario
          </button>
        </div>
      </div>
    </div>;
};
export default PartnerDashboard;