import React from 'react';
import { UserPlusIcon, BuildingIcon, FileTextIcon, CheckCircleIcon } from 'lucide-react';
const ActivityStream = () => {
  // Mock data for the activity stream
  const activities = [{
    id: 1,
    user: 'Emily Johnson',
    action: 'created',
    target: 'TechStart Inc',
    targetType: 'partner',
    time: 'Just now'
  }, {
    id: 2,
    user: 'Michael Brown',
    action: 'approved',
    target: 'Global Ventures',
    targetType: 'company',
    time: '10 minutes ago'
  }, {
    id: 3,
    user: 'Sarah Davis',
    action: 'uploaded',
    target: 'financial documents',
    targetType: 'document',
    time: '1 hour ago'
  }, {
    id: 4,
    user: 'Robert Wilson',
    action: 'created',
    target: 'Capital Partners',
    targetType: 'partner',
    time: '3 hours ago'
  }, {
    id: 5,
    user: 'Jennifer Lee',
    action: 'updated',
    target: 'Innovate Group',
    targetType: 'company',
    time: '5 hours ago'
  }];
  // Function to get the appropriate icon based on the target type
  const getActivityIcon = targetType => {
    switch (targetType) {
      case 'partner':
        return <UserPlusIcon size={16} />;
      case 'company':
        return <BuildingIcon size={16} />;
      case 'document':
        return <FileTextIcon size={16} />;
      case 'approval':
        return <CheckCircleIcon size={16} />;
      default:
        return <UserPlusIcon size={16} />;
    }
  };
  // Function to get the appropriate color based on the action
  const getActionColor = action => {
    switch (action) {
      case 'created':
        return 'bg-blue-100 text-blue-600';
      case 'approved':
        return 'bg-green-100 text-green-600';
      case 'rejected':
        return 'bg-red-100 text-red-600';
      case 'uploaded':
        return 'bg-purple-100 text-purple-600';
      case 'updated':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  return <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {activities.map(activity => <div key={activity.id} className="flex items-start">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getActionColor(activity.action)}`}>
            {getActivityIcon(activity.targetType)}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-neutral-dark">
                <span className="font-bold">{activity.user}</span>{' '}
                {activity.action}{' '}
                <span className="font-medium">{activity.target}</span>
              </p>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {activity.action === 'created' ? `New ${activity.targetType} added to the system` : activity.action === 'approved' ? `${activity.target} has been approved` : activity.action === 'uploaded' ? `New ${activity.target} uploaded` : `${activity.target} information updated`}
            </p>
          </div>
        </div>)}
      <div className="pt-2">
        <button className="text-sm text-primary font-medium hover:text-primary-light transition-colors">
          View All Activity
        </button>
      </div>
    </div>;
};
export default ActivityStream;