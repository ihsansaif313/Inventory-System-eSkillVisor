import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildingIcon, SearchIcon, TrendingUpIcon, TrendingDownIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';
const PartnerCompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  // Mock company data - in a real app this would come from an API
  const mockCompanies = [{
    id: '1',
    name: 'Acme Corp',
    manager: 'Emily Johnson',
    status: 'active',
    investment: 250000,
    revenue: 320000,
    profit: 70000,
    roi: 28,
    dateCreated: '2023-05-15'
  }, {
    id: '2',
    name: 'TechStart Inc',
    manager: 'Sarah Davis',
    status: 'active',
    investment: 180000,
    revenue: 210000,
    profit: 30000,
    roi: 16.7,
    dateCreated: '2023-06-22'
  }, {
    id: '3',
    name: 'Innovate Group',
    manager: 'Robert Wilson',
    status: 'pending',
    investment: 120000,
    revenue: 0,
    profit: 0,
    roi: 0,
    dateCreated: '2023-08-10'
  }];
  // Fetch companies
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setCompanies(mockCompanies);
      setLoading(false);
    }, 800);
  }, []);
  const handleCompanyClick = companyId => {
    navigate(`/partner/company/${companyId}`);
  };
  const filteredCompanies = companies.filter(company => company.name.toLowerCase().includes(searchQuery.toLowerCase()) || company.manager.toLowerCase().includes(searchQuery.toLowerCase()));
  if (loading) {
    return <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">
          My Companies
        </h1>
        <p className="text-neutral-dark text-opacity-70">
          View and manage all companies in your portfolio
        </p>
      </div>
      {/* Search and Filter */}
      <div className="flex justify-between mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" placeholder="Search companies..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>
      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map(company => <div key={company.id} onClick={() => handleCompanyClick(company.id)} className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-shadow hover:shadow-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-secondary bg-opacity-10 flex items-center justify-center text-secondary mr-3">
                    <BuildingIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-dark">
                      {company.name}
                    </h3>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      <span>Established: {company.dateCreated}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {company.status === 'active' ? 'Active' : 'Pending'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Investment</p>
                  <p className="text-sm font-bold text-neutral-dark">
                    ${company.investment.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="text-sm font-bold text-neutral-dark">
                    ${company.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div className={`flex items-center ${company.profit > 0 ? 'text-green-600' : company.profit < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {company.profit > 0 ? <TrendingUpIcon className="h-4 w-4 mr-1" /> : company.profit < 0 ? <TrendingDownIcon className="h-4 w-4 mr-1" /> : null}
                  <span className="text-sm font-medium">
                    {company.profit > 0 ? '+' : ''}$
                    {Math.abs(company.profit).toLocaleString()} (
                    {company.roi > 0 ? '+' : ''}
                    {company.roi}%)
                  </span>
                </div>
                <button className="text-primary hover:text-primary-light flex items-center text-sm">
                  View Details
                  <ArrowRightIcon size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>)}
      </div>
      {filteredCompanies.length === 0 && <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <BuildingIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No companies found
          </h3>
          <p className="text-gray-500">
            {searchQuery ? `No results found for "${searchQuery}"` : "You don't have any companies in your portfolio yet"}
          </p>
        </div>}
    </div>;
};
export default PartnerCompanyList;