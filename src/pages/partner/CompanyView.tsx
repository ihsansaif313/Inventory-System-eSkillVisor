import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BuildingIcon, FileTextIcon, DollarSignIcon, TrendingUpIcon, TrendingDownIcon, CalendarIcon, UserIcon } from 'lucide-react';
const PartnerCompanyView = () => {
  const {
    id
  } = useParams();
  const [company, setCompany] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  // Mock company data
  const mockCompanies = [{
    id: '1',
    name: 'Acme Corp',
    manager: 'Emily Johnson',
    status: 'active',
    investment: 250000,
    revenue: 320000,
    profit: 70000,
    roi: 28,
    dateCreated: '2023-05-15',
    transactions: [{
      id: 1,
      type: 'investment',
      amount: 150000,
      description: 'Initial investment',
      date: '2023-05-15'
    }, {
      id: 2,
      type: 'investment',
      amount: 50000,
      description: 'Office equipment purchase',
      date: '2023-06-20'
    }, {
      id: 3,
      type: 'investment',
      amount: 50000,
      description: 'Inventory purchase',
      date: '2023-07-10'
    }, {
      id: 4,
      type: 'revenue',
      amount: 120000,
      description: 'Q2 Sales',
      date: '2023-07-15'
    }, {
      id: 5,
      type: 'revenue',
      amount: 200000,
      description: 'Q3 Sales',
      date: '2023-10-05'
    }],
    documents: [{
      id: 1,
      name: 'Company Registration.pdf',
      date: '2023-05-15',
      type: 'registration'
    }, {
      id: 2,
      name: 'Business Plan.pdf',
      date: '2023-05-15',
      type: 'business_plan'
    }, {
      id: 3,
      name: 'Q2 Financial Report.pdf',
      date: '2023-07-20',
      type: 'financial'
    }, {
      id: 4,
      name: 'Q3 Financial Report.pdf',
      date: '2023-10-10',
      type: 'financial'
    }]
  }, {
    id: '2',
    name: 'TechStart Inc',
    manager: 'Sarah Davis',
    status: 'active',
    investment: 180000,
    revenue: 210000,
    profit: 30000,
    roi: 16.7,
    dateCreated: '2023-06-22',
    transactions: [{
      id: 1,
      type: 'investment',
      amount: 120000,
      description: 'Initial investment',
      date: '2023-06-22'
    }, {
      id: 2,
      type: 'investment',
      amount: 60000,
      description: 'Software development',
      date: '2023-08-15'
    }, {
      id: 3,
      type: 'revenue',
      amount: 90000,
      description: 'Q2 Sales',
      date: '2023-09-10'
    }, {
      id: 4,
      type: 'revenue',
      amount: 120000,
      description: 'Q3 Sales',
      date: '2023-10-20'
    }],
    documents: [{
      id: 1,
      name: 'Company Registration.pdf',
      date: '2023-06-22',
      type: 'registration'
    }, {
      id: 2,
      name: 'Tech Specifications.pdf',
      date: '2023-06-25',
      type: 'technical'
    }, {
      id: 3,
      name: 'Q2 Financial Report.pdf',
      date: '2023-09-15',
      type: 'financial'
    }]
  }, {
    id: '3',
    name: 'Innovate Group',
    manager: 'Robert Wilson',
    status: 'pending',
    investment: 120000,
    revenue: 0,
    profit: 0,
    roi: 0,
    dateCreated: '2023-08-10',
    transactions: [{
      id: 1,
      type: 'investment',
      amount: 120000,
      description: 'Initial investment',
      date: '2023-08-10'
    }],
    documents: [{
      id: 1,
      name: 'Company Registration.pdf',
      date: '2023-08-10',
      type: 'registration'
    }, {
      id: 2,
      name: 'Business Proposal.pdf',
      date: '2023-08-10',
      type: 'business_plan'
    }]
  }];
  // Fetch company data
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundCompany = mockCompanies.find(c => c.id === id);
      setCompany(foundCompany || mockCompanies[0]); // Default to first company if not found
      setLoading(false);
    }, 800);
  }, [id]);
  if (loading) {
    return <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  if (!company) {
    return <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Company not found
        </div>
      </div>;
  }
  return <div className="p-6">
      {/* Company Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-16 w-16 rounded-lg bg-secondary bg-opacity-10 flex items-center justify-center text-secondary mr-4">
              <BuildingIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-dark">
                {company.name}
              </h1>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Established: {company.dateCreated}</span>
                <span className="mx-2">•</span>
                <UserIcon className="h-4 w-4 mr-1" />
                <span>Manager: {company.manager}</span>
              </div>
            </div>
          </div>
          <div>
            {company.status === 'active' ? <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                Active
              </span> : <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                Pending Approval
              </span>}
          </div>
        </div>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Total Investment</div>
            <div className="text-xl font-bold text-neutral-dark">
              ${company.investment.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
            <div className="text-xl font-bold text-neutral-dark">
              ${company.revenue.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Profit/Loss</div>
            <div className={`text-xl font-bold flex items-center ${company.profit > 0 ? 'text-green-600' : company.profit < 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {company.profit > 0 ? <TrendingUpIcon className="h-5 w-5 mr-1" /> : company.profit < 0 ? <TrendingDownIcon className="h-5 w-5 mr-1" /> : null}
              ${Math.abs(company.profit).toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">ROI</div>
            <div className={`text-xl font-bold ${company.roi > 0 ? 'text-green-600' : 'text-gray-500'}`}>
              {company.roi}%
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button className={`py-3 px-4 text-sm font-medium ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`py-3 px-4 text-sm font-medium ${activeTab === 'transactions' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('transactions')}>
          Transactions
        </button>
        <button className={`py-3 px-4 text-sm font-medium ${activeTab === 'documents' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('documents')}>
          Documents
        </button>
      </div>
      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {activeTab === 'overview' && <div>
            <h2 className="text-lg font-bold text-neutral-dark mb-4">
              Company Performance
            </h2>
            {/* Performance Chart (simplified) */}
            <div className="h-64 bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-500">
                  Revenue vs Investment
                </div>
                <div className="flex space-x-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                    <span className="text-xs text-gray-500">Investment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-secondary mr-1"></div>
                    <span className="text-xs text-gray-500">Revenue</span>
                  </div>
                </div>
              </div>
              <div className="h-40 flex items-end justify-around">
                {company.transactions.filter(t => t.type === 'investment').map((t, i) => <div key={i} className="flex flex-col items-center">
                      <div className="w-10 bg-primary rounded-t-sm" style={{
                height: `${t.amount / company.investment * 100}%`
              }}></div>
                      <div className="text-xs text-gray-500 mt-1">
                        {t.date.split('-')[1]}
                      </div>
                    </div>)}
                {company.transactions.filter(t => t.type === 'revenue').map((t, i) => <div key={i} className="flex flex-col items-center">
                      <div className="w-10 bg-secondary rounded-t-sm" style={{
                height: `${t.amount / company.investment * 100}%`
              }}></div>
                      <div className="text-xs text-gray-500 mt-1">
                        {t.date.split('-')[1]}
                      </div>
                    </div>)}
              </div>
            </div>
            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Company Status
                </h3>
                <p className="text-sm text-gray-700">
                  {company.status === 'active' ? 'Your company is fully operational and active in our system. You can view all transactions and documents related to your business.' : 'Your company is currently pending approval. Once approved, you will be able to see all transactions and performance metrics.'}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Next Steps
                </h3>
                <p className="text-sm text-gray-700">
                  {company.status === 'active' ? 'Work with your manager to record new sales and investments to grow your business metrics.' : 'Please ensure all required documents have been submitted. Your manager will guide you through the approval process.'}
                </p>
              </div>
            </div>
          </div>}
        {activeTab === 'transactions' && <div>
            <h2 className="text-lg font-bold text-neutral-dark mb-4">
              Transaction History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {company.transactions.map(transaction => <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.type === 'investment' ? <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            Investment
                          </span> : <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Revenue
                          </span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.description}
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>}
        {activeTab === 'documents' && <div>
            <h2 className="text-lg font-bold text-neutral-dark mb-4">
              Company Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.documents.map(document => <div key={document.id} className="border border-gray-200 rounded-lg p-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4">
                    <FileTextIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-dark">
                      {document.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Uploaded: {document.date}
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary-light text-sm font-medium">
                    View
                  </button>
                </div>)}
            </div>
            {company.documents.length === 0 && <div className="text-center py-8 text-gray-500">
                No documents available
              </div>}
          </div>}
      </div>
    </div>;
};
export default PartnerCompanyView;