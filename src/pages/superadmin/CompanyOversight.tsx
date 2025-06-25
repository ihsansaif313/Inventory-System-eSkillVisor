import React, { useState } from 'react';
import { BuildingIcon, SearchIcon, FilterIcon, MoreHorizontalIcon, EditIcon, TrashIcon, CheckIcon, XIcon, AlertTriangleIcon, FileTextIcon, DollarSignIcon, PlusIcon } from 'lucide-react';
const CompanyOversight = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCompanyData, setNewCompanyData] = useState({
    name: '',
    partner: '',
    manager: '',
    investment: ''
  });
  // Mock data for partners and managers
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
  const managers = [{
    id: 1,
    name: 'Emily Johnson'
  }, {
    id: 2,
    name: 'Sarah Davis'
  }, {
    id: 3,
    name: 'Michael Brown'
  }];
  // Mock data
  const companies = [{
    id: 1,
    name: 'Acme Corp',
    partner: 'John Smith',
    manager: 'Emily Johnson',
    status: 'active',
    investment: 250000,
    revenue: 320000,
    documentComplete: true,
    dateCreated: '2023-05-15'
  }, {
    id: 2,
    name: 'TechStart Inc',
    partner: 'Michael Brown',
    manager: 'Sarah Davis',
    status: 'active',
    investment: 180000,
    revenue: 210000,
    documentComplete: true,
    dateCreated: '2023-06-22'
  }, {
    id: 3,
    name: 'Global Ventures',
    partner: 'Robert Wilson',
    manager: 'Emily Johnson',
    status: 'pending_approval',
    investment: 120000,
    revenue: 0,
    documentComplete: false,
    dateCreated: '2023-08-10'
  }, {
    id: 4,
    name: 'Future Fund',
    partner: 'Jennifer Lee',
    manager: 'Sarah Davis',
    status: 'pending_approval',
    investment: 300000,
    revenue: 0,
    documentComplete: true,
    dateCreated: '2023-09-05'
  }, {
    id: 5,
    name: 'Capital Partners',
    partner: 'David Chen',
    manager: 'Michael Brown',
    status: 'active',
    investment: 420000,
    revenue: 380000,
    documentComplete: true,
    dateCreated: '2023-04-18'
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
      case 'declined':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Declined
          </span>;
      default:
        return null;
    }
  };
  const filteredCompanies = companies.filter(company => {
    // Filter by tab
    if (activeTab === 'pending' && company.status !== 'pending_approval') return false;
    if (activeTab === 'active' && company.status !== 'active') return false;
    // Filter by search
    return company.name.toLowerCase().includes(searchQuery.toLowerCase()) || company.partner.toLowerCase().includes(searchQuery.toLowerCase()) || company.manager.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const handleApprove = () => {
    // In a real app, this would make an API call
    console.log('Approving company:', selectedCompany.id);
    setShowApprovalModal(false);
  };
  const handleDecline = () => {
    // In a real app, this would make an API call
    console.log('Declining company:', selectedCompany.id);
    setShowApprovalModal(false);
  };
  const openApprovalModal = company => {
    setSelectedCompany(company);
    setShowApprovalModal(true);
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
      manager: '',
      investment: ''
    });
  };
  return <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">
          Company Oversight
        </h1>
        <p className="text-neutral-dark text-opacity-70">
          Manage and approve companies across the platform
        </p>
      </div>
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex space-x-2">
          <button className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'all' ? 'bg-primary text-white' : 'bg-white text-neutral-dark'}`} onClick={() => setActiveTab('all')}>
            All Companies
          </button>
          <button className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'pending' ? 'bg-primary text-white' : 'bg-white text-neutral-dark'}`} onClick={() => setActiveTab('pending')}>
            Pending Approval
          </button>
          <button className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'active' ? 'bg-primary text-white' : 'bg-white text-neutral-dark'}`} onClick={() => setActiveTab('active')}>
            Active
          </button>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" placeholder="Search companies..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FilterIcon className="h-5 w-5 text-gray-500" />
          </button>
          <button className="btn-primary flex items-center px-4" onClick={() => setShowCreateModal(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Register Company
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
                  Manager
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
                        <div className="text-xs text-gray-500">
                          Created: {company.dateCreated}
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
                    <div className="text-sm text-gray-900">
                      {company.manager}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(company.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${company.investment.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${company.revenue.toLocaleString()}
                    </div>
                    {company.revenue > 0 && <div className="text-xs text-green-600">
                        {Math.round((company.revenue / company.investment - 1) * 100)}
                        % ROI
                      </div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {company.status === 'pending_approval' && <button className="p-1 text-yellow-600 hover:text-yellow-900" onClick={() => openApprovalModal(company)}>
                          <AlertTriangleIcon className="h-5 w-5" />
                        </button>}
                      <button className="p-1 text-blue-600 hover:text-blue-900">
                        <EditIcon className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {/* Approval Modal */}
      {showApprovalModal && selectedCompany && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowApprovalModal(false)}></div>
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangleIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Company Approval - {selectedCompany.name}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Review the company information before approving or
                        declining.
                      </p>
                    </div>
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Partner</p>
                          <p className="text-sm font-medium">
                            {selectedCompany.partner}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Manager</p>
                          <p className="text-sm font-medium">
                            {selectedCompany.manager}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Investment</p>
                          <p className="text-sm font-medium">
                            ${selectedCompany.investment.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date Created</p>
                          <p className="text-sm font-medium">
                            {selectedCompany.dateCreated}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center">
                          <FileTextIcon className="h-4 w-4 text-gray-500 mr-2" />
                          <p className="text-sm">
                            Documents:
                            <span className={selectedCompany.documentComplete ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                              {selectedCompany.documentComplete ? 'Complete' : 'Incomplete'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleApprove}>
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Approve
                </button>
                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleDecline}>
                  <XIcon className="h-5 w-5 mr-2" />
                  Decline
                </button>
                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm" onClick={() => setShowApprovalModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>}
      {/* Register Company Modal */}
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
                          <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                            Manager
                          </label>
                          <select id="manager" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" value={newCompanyData.manager} onChange={e => setNewCompanyData({
                        ...newCompanyData,
                        manager: e.target.value
                      })} required>
                            <option value="">Select a manager</option>
                            {managers.map(manager => <option key={manager.id} value={manager.name}>
                                {manager.name}
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
    </div>;
};
export default CompanyOversight;