import React from 'react';
import { ClockIcon, AlertCircleIcon } from 'lucide-react';
const ApprovalHeatmap = () => {
  // Mock data for the heatmap
  const heatmapData = [{
    id: 1,
    manager: 'John Smith',
    partner: 'Acme Corp',
    days: 1,
    urgency: 'low'
  }, {
    id: 2,
    manager: 'Emily Johnson',
    partner: 'TechStart Inc',
    days: 3,
    urgency: 'medium'
  }, {
    id: 3,
    manager: 'Michael Brown',
    partner: 'Global Ventures',
    days: 5,
    urgency: 'medium'
  }, {
    id: 4,
    manager: 'Sarah Davis',
    partner: 'Future Fund',
    days: 7,
    urgency: 'high'
  }, {
    id: 5,
    manager: 'Robert Wilson',
    partner: 'Capital Partners',
    days: 9,
    urgency: 'critical'
  }, {
    id: 6,
    manager: 'Jennifer Lee',
    partner: 'Innovate Group',
    days: 2,
    urgency: 'low'
  }];
  // Function to determine background color based on urgency
  const getUrgencyColor = urgency => {
    switch (urgency) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  // Function to get urgency icon
  const getUrgencyIcon = urgency => {
    if (urgency === 'high' || urgency === 'critical') {
      return <AlertCircleIcon size={14} className="mr-1" />;
    }
    return <ClockIcon size={14} className="mr-1" />;
  };
  return <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {heatmapData.map(item => <div key={item.id} className={`rounded-lg p-4 cursor-pointer transition-all hover:shadow-md border ${getUrgencyColor(item.urgency)}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold">{item.partner}</h4>
              <div className="flex items-center text-xs font-medium">
                {getUrgencyIcon(item.urgency)}
                {item.days} {item.days === 1 ? 'day' : 'days'}
              </div>
            </div>
            <p className="text-sm opacity-80">Manager: {item.manager}</p>
            <div className="mt-2 text-xs font-medium uppercase flex items-center">
              <span className={`w-2 h-2 rounded-full mr-1 ${item.urgency === 'low' ? 'bg-green-500' : item.urgency === 'medium' ? 'bg-yellow-500' : item.urgency === 'high' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
              {item.urgency} urgency
            </div>
            <div className="mt-2 w-full h-1 bg-white rounded-full overflow-hidden">
              <div className={`h-1 ${item.urgency === 'low' ? 'bg-green-500' : item.urgency === 'medium' ? 'bg-yellow-500' : item.urgency === 'high' ? 'bg-orange-500' : 'bg-red-500'}`} style={{
            width: `${item.days / 10 * 100}%`
          }}></div>
            </div>
          </div>)}
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-neutral-dark">Low</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-xs text-neutral-dark">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-xs text-neutral-dark">High</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs text-neutral-dark">Critical</span>
          </div>
        </div>
      </div>
    </div>;
};
export default ApprovalHeatmap;