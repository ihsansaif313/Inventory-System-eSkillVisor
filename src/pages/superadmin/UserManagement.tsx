import React, { useState } from 'react';
import { UserPlusIcon, SearchIcon, FilterIcon, MoreHorizontalIcon, EditIcon, TrashIcon, CheckIcon, XIcon, MailIcon, UserIcon, ShieldIcon, Building2Icon } from 'lucide-react';
const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('managers');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    phone: ''
  });
  // Mock data
  const managers = [{
    id: 1,
    name: 'John Smith',
    email: 'john.smith@enterprise.com',
    status: 'active',
    companies: 12,
    partners: 8
  }, {
    id: 2,
    name: 'Emily Johnson',
    email: 'emily.johnson@enterprise.com',
    status: 'active',
    companies: 8,
    partners: 5
  }, {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@enterprise.com',
    status: 'inactive',
    companies: 0,
    partners: 0
  }, {
    id: 4,
    name: 'Sarah Davis',
    email: 'sarah.davis@enterprise.com',
    status: 'active',
    companies: 15,
    partners: 10
  }, {
    id: 5,
    name: 'Robert Wilson',
    email: 'robert.wilson@enterprise.com',
    status: 'pending',
    companies: 0,
    partners: 0
  }];
  const partners = [{
    id: 1,
    name: 'Acme Corp',
    email: 'contact@acmecorp.com',
    status: 'active',
    companies: 3,
    manager: 'John Smith'
  }, {
    id: 2,
    name: 'TechStart Inc',
    email: 'admin@techstart.com',
    status: 'active',
    companies: 1,
    manager: 'Emily Johnson'
  }, {
    id: 3,
    name: 'Global Ventures',
    email: 'info@globalventures.com',
    status: 'active',
    companies: 2,
    manager: 'Sarah Davis'
  }, {
    id: 4,
    name: 'Future Fund',
    email: 'support@futurefund.com',
    status: 'pending',
    companies: 0,
    manager: 'John Smith'
  }, {
    id: 5,
    name: 'Capital Partners',
    email: 'hello@capitalpartners.com',
    status: 'active',
    companies: 1,
    manager: 'Sarah Davis'
  }, {
    id: 6,
    name: 'Innovate Group',
    email: 'contact@innovategroup.com',
    status: 'inactive',
    companies: 0,
    manager: 'Robert Wilson'
  }];
  const getStatusBadge = status => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Active
          </span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            Inactive
          </span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>;
      default:
        return null;
    }
  };
  const handleCreateUser = e => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log('Creating user:', newUserData);
    setShowCreateModal(false);
    // Reset form
    setNewUserData({
      name: '',
      email: '',
      jobTitle: '',
      phone: ''
    });
  };
  const filteredManagers = managers.filter(manager => manager.name.toLowerCase().includes(searchQuery.toLowerCase()) || manager.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPartners = partners.filter(partner => partner.name.toLowerCase().includes(searchQuery.toLowerCase()) || partner.email.toLowerCase().includes(searchQuery.toLowerCase()) || partner.manager.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">
          User Management
        </h1>
        <p className="text-neutral-dark text-opacity-70">
          Manage managers and partners across the platform
        </p>
      </div>
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex space-x-2">
          <button className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'managers' ? 'bg-primary text-white' : 'bg-white text-neutral-dark'}`} onClick={() => setActiveTab('managers')}>
            Managers
          </button>
          <button className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'partners' ? 'bg-primary text-white' : 'bg-white text-neutral-dark'}`} onClick={() => setActiveTab('partners')}>
            Partners
          </button>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FilterIcon className="h-5 w-5 text-gray-500" />
          </button>
          <button className="btn-primary flex items-center px-4" onClick={() => setShowCreateModal(true)}>
            <UserPlusIcon className="h-5 w-5 mr-2" />
            <span>
              {activeTab === 'managers' ? 'Add Manager' : 'Add Partner'}
            </span>
          </button>
        </div>
      </div>
      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {activeTab === 'managers' ? <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Companies
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partners
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredManagers.map(manager => <tr key={manager.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {manager.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {manager.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(manager.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {manager.companies}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {manager.partners}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-900">
                          <EditIcon className="h-5 w-5" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontalIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div> : <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Companies
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPartners.map(partner => <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center text-secondary">
                          <Building2Icon className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {partner.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {partner.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(partner.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {partner.companies}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {partner.manager}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-900">
                          <div className="h-5 w-5" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <div className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>}
      </div>
      {/* Create User Modal */}
      {showCreateModal && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)}></div>
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                    <UserPlusIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {activeTab === 'managers' ? 'Create Manager Account' : 'Create Partner Account'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            {activeTab === 'managers' ? 'Full Name' : 'Company Name'}
                          </label>
                          <input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" value={newUserData.name} onChange={e => setNewUserData({
                        ...newUserData,
                        name: e.target.value
                      })} required />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" value={newUserData.email} onChange={e => setNewUserData({
                        ...newUserData,
                        email: e.target.value
                      })} required />
                        </div>
                        {activeTab === 'managers' && <div>
                            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                              Job Title
                            </label>
                            <input type="text" id="jobTitle" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" value={newUserData.jobTitle} onChange={e => setNewUserData({
                        ...newUserData,
                        jobTitle: e.target.value
                      })} />
                          </div>}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input type="tel" id="phone" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" value={newUserData.phone} onChange={e => setNewUserData({
                        ...newUserData,
                        phone: e.target.value
                      })} />
                        </div>
                        {activeTab === 'partners' && <div>
                            <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                              Assign Manager
                            </label>
                            <select id="manager" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                              <option value="">Select a manager</option>
                              {managers.filter(m => m.status === 'active').map(manager => <option key={manager.id} value={manager.id}>
                                    {manager.name}
                                  </option>)}
                            </select>
                          </div>}
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                            Create
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
export default UserManagement;