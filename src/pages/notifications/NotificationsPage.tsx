import React, { useState, useContext } from 'react';
import { BellIcon, CheckIcon, TrashIcon, UserPlusIcon, Building2Icon, FileTextIcon, CheckCircleIcon, ClockIcon, MailIcon } from 'lucide-react';
import { AuthContext } from '../../App';
const NotificationsPage = () => {
  const {
    userRole
  } = useContext(AuthContext);
  // All notifications including approval types
  const allNotifications = [{
    id: 1,
    title: 'New Partner Registration',
    message: 'TechStart Inc has registered as a new partner.',
    time: '10 minutes ago',
    read: false,
    type: 'partner'
  }, {
    id: 2,
    title: 'Approval Required',
    message: 'Capital Partners company registration requires your approval.',
    time: '1 hour ago',
    read: false,
    type: 'approval'
  }, {
    id: 3,
    title: 'Documents Uploaded',
    message: 'Financial documents uploaded for Global Ventures.',
    time: '3 hours ago',
    read: true,
    type: 'document'
  }, {
    id: 4,
    title: 'Investment Added',
    message: 'New investment of $50,000 added to Acme Corp.',
    time: '1 day ago',
    read: true,
    type: 'investment'
  }, {
    id: 5,
    title: 'Revenue Recorded',
    message: 'New revenue of $120,000 recorded for TechStart Inc.',
    time: '2 days ago',
    read: true,
    type: 'revenue'
  }];
  // Filter out approval notifications for partners
  const [notifications, setNotifications] = useState(userRole === 'partner' ? allNotifications.filter(notification => notification.type !== 'approval') : allNotifications);
  const [filter, setFilter] = useState('all');
  const markAsRead = id => {
    setNotifications(notifications.map(notification => notification.id === id ? {
      ...notification,
      read: true
    } : notification));
  };
  const deleteNotification = id => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  const getNotificationIcon = type => {
    switch (type) {
      case 'partner':
        return <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <UserPlusIcon size={20} />
          </div>;
      case 'approval':
        return <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <CheckCircleIcon size={20} />
          </div>;
      case 'document':
        return <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <FileTextIcon size={20} />
          </div>;
      case 'investment':
        return <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Building2Icon size={20} />
          </div>;
      case 'revenue':
        return <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            <ClockIcon size={20} />
          </div>;
      default:
        return <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <BellIcon size={20} />
          </div>;
    }
  };
  // Determine available filters based on user role
  const getFilterButtons = () => {
    const buttons = [<button key="all" className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setFilter('all')}>
        All
      </button>, <button key="unread" className={`px-3 py-1 text-sm rounded-md ${filter === 'unread' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setFilter('unread')}>
        Unread
      </button>];
    // Only show approval filter for non-partner roles
    if (userRole !== 'partner') {
      buttons.push(<button key="approval" className={`px-3 py-1 text-sm rounded-md ${filter === 'approval' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setFilter('approval')}>
          Approvals
        </button>);
    }
    return buttons;
  };
  const filteredNotifications = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter);
  return <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">
          Notifications
        </h1>
        <p className="text-neutral-dark text-opacity-70">
          Stay updated with the latest activities and alerts
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex space-x-2">{getFilterButtons()}</div>
          <button className="text-sm text-primary hover:text-primary-light flex items-center" onClick={markAllAsRead}>
            <CheckIcon size={16} className="mr-1" />
            Mark all as read
          </button>
        </div>
        <div className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
          {filteredNotifications.length > 0 ? filteredNotifications.map(notification => <div key={notification.id} className={`p-4 hover:bg-gray-50 transition-colors ${notification.read ? 'opacity-75' : ''}`}>
                <div className="flex items-start">
                  {getNotificationIcon(notification.type)}
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-dark flex items-center">
                          {notification.title}
                          {!notification.read && <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span>}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-end space-x-2">
                      {!notification.read && <button className="text-xs text-blue-600 hover:text-blue-800" onClick={() => markAsRead(notification.id)}>
                          Mark as read
                        </button>}
                      <button className="text-xs text-red-600 hover:text-red-800" onClick={() => deleteNotification(notification.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>) : <div className="p-8 text-center text-gray-500">
              <BellIcon size={40} className="mx-auto mb-4 text-gray-300" />
              <p>No notifications found</p>
            </div>}
        </div>
      </div>
    </div>;
};
export default NotificationsPage;