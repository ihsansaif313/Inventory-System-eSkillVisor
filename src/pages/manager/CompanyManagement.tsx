import React, { useState } from 'react';
import { BuildingIcon, SearchIcon, TrashIcon, UserIcon, FileTextIcon, DollarSignIcon, PlusIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
const CompanyManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState('investment');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCompanyData, setNewCompanyData] = useState({
    name: '',
    partner: '',
    investment: ''
  });
  const [transactionData, setTransactionData] = useState({
    amount: '',
    description: ''
  });
  // Mock data
  const companies = [{
    id: 1,
    name: 'Acme Corp',
    partner: 'John Smith',
    status: 'active',
    investment: 250000,
    revenue: 320000,
    profit: 70000,
    documentComplete: true
  }, {
    id: 2,
    name: 'TechStart Inc',
    partner: 'Michael Brown',
    status: 'active',
    investment: 180000,
    revenue: 210000,
    profit: 30000,
    documentComplete: true
  }, {
    id: 3,
    name: 'Global Ventures',
    partner: 'Robert Wilson',
    status: 'pending_approval',
    investment: 120000,
    revenue: 0,
    profit: 0,
    documentComplete: false
  }, {
    id: 4,
    name: 'Future Fund',
    partner: 'Jennifer Lee',
    status: 'pending_approval',
    investment: 300000,
    revenue: 0,
    profit: 0,
    documentComplete: true
  }, {
    id: 5,
    name: 'Capital Partners',
    partner: 'David Chen',
    status: 'active',
    investment: 420000,
    revenue: 380000,
    profit: -40000,
    documentComplete: true
  }];
  // Mock partners for dropdown
  const partners = [{
    id: 1,
    name: 'John Smith'
  }, {
    id: 2,
    name: 'Michael Brown'
  }, {
    id: 3,
    name: 'Robert Wilson'
  }, {
    id: 4,
    name: 'Jennifer Lee'
  }, {
    id: 5,
    name: 'David Chen'
  }];
  const getStatusBadge = status => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Active
          </span>;
      case 'pending_approval':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Pending Approval
          </span>;
      default:
        return null;
    }
  };
  const handleCreateCompany = e => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log('Creating company:', newCompanyData);
    setShowCreateModal(false);
    // Reset form
    setNewCompanyData({
      name: '',
      partner: '',
      investment: ''
    });
  };
  const handleSubmitTransaction = e => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log('Adding transaction:', {
      companyId: selectedCompany.id,
      type: transactionType,
      ...transactionData
    });
    setShowTransactionModal(false);
    // Reset form
    setTransactionData({
      amount: '',
      description: ''
    });
  };
  const openTransactionModal = (company, type) => {
    setSelectedCompany(company);
    setTransactionType(type);
    setShowTransactionModal(true);
  };
  const filteredCompanies = companies.filter(company => company.name.toLowerCase().includes(searchQuery.toLowerCase()) || company.partner.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">
          Company Management
        </h1>
        <p className="text-neutral-dark text-opacity-70">
          Create and manage companies for your partners
        </p>
      </div>
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div className="text-sm text-gray-500">
          Showing {filteredCompanies.length} companies
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" placeholder="Search companies..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <div className="h-5 w-5 text-gray-500" />
          </button>
          <button className="btn-primary flex items-center px-4" onClick={() => setShowCreateModal(true)}>
            <BuildingIcon className="h-5 w-5 mr-2" />
            <span>Register Company</span>
          </button>
        </div>
      </div>
      {/* Companies Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit/Loss
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map(company => <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center text-secondary">
                        <BuildingIcon className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {company.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {company.partner}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(company.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${company.investment.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${company.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${company.profit > 0 ? 'text-green-600' : company.profit < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {company.profit > 0 ? <TrendingUpIcon className="h-4 w-4 mr-1" /> : company.profit < 0 ? <TrendingDownIcon className="h-4 w-4 mr-1" /> : null}
                      <span className="text-sm font-medium">
                        {company.profit > 0 ? '+' : ''}$
                        {Math.abs(company.profit).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {company.status === 'active' && <>
                          <button className="p-1 text-green-600 hover:text-green-900" onClick={() => openTransactionModal(company, 'investment')}>
                            <DollarSignIcon className="h-5 w-5" />
                          </button>
                          <button className="p-1 text-blue-600 hover:text-blue-900" onClick={() => openTransactionModal(company, 'revenue')}>
                            <TrendingUpIcon className="h-5 w-5" />
                          </button>
                        </>}
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <div className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {/* Create Company Modal */}
      {showCreateModal && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)}></div>
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                    <BuildingIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Register New Company
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleCreateCompany} className="space-y-4">
                        <div>
                          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                            Company Name
                          </label>
                          <input type="text" id="companyName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" value={newCompanyData.name} onChange={e => setNewCompanyData({
                        ...newCompanyData,
                        name: e.target.value
                      })} required />
                        </div>
                        <div>
                          <label htmlFor="partner" className="block text-sm font-medium text-gray-700">
                            Partner
                          </label>
                          <select id="partner" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" value={newCompanyData.partner} onChange={e => setNewCompanyData({
                        ...newCompanyData,
                        partner: e.target.value
                      })} required>
                            <option value="">Select a partner</option>
                            {partners.map(partner => <option key={partner.id} value={partner.name}>
                                {partner.name}
                              </option>)}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="investment" className="block text-sm font-medium text-gray-700">
                            Initial Investment
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input type="number" id="investment" className="pl-7 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" placeholder="0.00" value={newCompanyData.investment} onChange={e => setNewCompanyData({
                          ...newCompanyData,
                          investment: e.target.value
                        })} required />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                            Company Documents
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                  <span>Upload files</span>
                                  <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PDF, DOC, XLS up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                            Register Company
                          </button>
                          <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm" onClick={() => setShowCreateModal(false)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
      {/* Transaction Modal */}
      {showTransactionModal && selectedCompany && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowTransactionModal(false)}></div>
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                    {transactionType === 'investment' ? <DollarSignIcon className="h-6 w-6 text-primary" /> : <TrendingUpIcon className="h-6 w-6 text-primary" />}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {transactionType === 'investment' ? 'Add Investment' : 'Record Revenue'}{' '}
                      - {selectedCompany.name}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmitTransaction} className="space-y-4">
                        <div>
                          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Amount
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input type="number" id="amount" className="pl-7 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" placeholder="0.00" value={transactionData.amount} onChange={e => setTransactionData({
                          ...transactionData,
                          amount: e.target.value
                        })} required />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea id="description" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" placeholder={transactionType === 'investment' ? 'e.g., Purchased new equipment' : 'e.g., Sold 5 units to Client X'} value={transactionData.description} onChange={e => setTransactionData({
                        ...transactionData,
                        description: e.target.value
                      })} required />
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                            Submit
                          </button>
                          <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm" onClick={() => setShowTransactionModal(false)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
export default CompanyManagement;