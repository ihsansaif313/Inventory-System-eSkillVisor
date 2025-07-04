import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, HomeIcon, UsersIcon, Building2Icon, LogOutIcon, ChevronDownIcon, FileTextIcon, BellIcon, SettingsIcon, PackageIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import { AuthContext } from '../../App.jsx';
import notificationService from '../../services/notificationService.js';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const { user, userRole, userEmail, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadNotificationCount = async () => {
      try {
        if (user) {
          const notifications = await notificationService.getNotifications({ is_read: false });
          setNotificationsCount(notifications.length);
        }
      } catch (error) {
        console.error('Failed to load notification count:', error);
        setNotificationsCount(0);
      }
    };

    loadNotificationCount();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    switch (userRole) {
      case 'super_admin':
        return [
          {
            name: 'Dashboard',
            icon: <HomeIcon size={20} />,
            path: '/superadmin'
          },
          {
            name: 'User Management',
            icon: <UsersIcon size={20} />,
            path: '/superadmin/users'
          },
          {
            name: 'Company Oversight',
            icon: <Building2Icon size={20} />,
            path: '/superadmin/companies'
          },
          {
            name: 'Inventory',
            icon: <PackageIcon size={20} />,
            path: '/superadmin/inventory'
          },
          {
            name: 'Notifications',
            icon: <BellIcon size={20} />,
            path: '/superadmin/notifications',
            badge: notificationsCount
          },
          {
            name: 'Settings',
            icon: <SettingsIcon size={20} />,
            path: '/superadmin/settings'
          }
        ];
      case 'manager':
        return [
          {
            name: 'Dashboard',
            icon: <HomeIcon size={20} />,
            path: '/manager'
          },
          {
            name: 'Partners',
            icon: <UsersIcon size={20} />,
            path: '/manager/partners'
          },
          {
            name: 'Companies',
            icon: <Building2Icon size={20} />,
            path: '/manager/companies'
          },
          {
            name: 'Inventory',
            icon: <PackageIcon size={20} />,
            path: '/manager/inventory'
          },
          {
            name: 'Notifications',
            icon: <BellIcon size={20} />,
            path: '/manager/notifications',
            badge: notificationsCount
          },
          {
            name: 'Settings',
            icon: <SettingsIcon size={20} />,
            path: '/manager/settings'
          }
        ];
      case 'partner':
        return [
          {
            name: 'Portfolio',
            icon: <HomeIcon size={20} />,
            path: '/partner'
          },
          {
            name: 'Companies',
            icon: <Building2Icon size={20} />,
            path: '/partner/companies'
          },
          {
            name: 'Inventory',
            icon: <PackageIcon size={20} />,
            path: '/partner/inventory'
          },
          {
            name: 'Notifications',
            icon: <BellIcon size={20} />,
            path: '/partner/notifications',
            badge: notificationsCount
          },
          {
            name: 'Settings',
            icon: <SettingsIcon size={20} />,
            path: '/partner/settings'
          }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-neutral-light overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-secondary transition duration-300 ease-in-out md:relative md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-secondary-dark">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">
                Enterprise Portal
              </span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="text-white md:hidden"
            >
              <XIcon size={24} />
            </button>
          </div>

          {/* User info */}
          <div className="px-4 py-4 border-b border-secondary-dark">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {userRole?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {userRole === 'super_admin' ? 'Super Admin' : userRole === 'manager' ? 'Manager' : 'Partner'}
                </p>
                <p className="text-xs text-white text-opacity-70">
                  {userEmail || 'No email'}
                </p>
              </div>
              <ChevronDownIcon size={16} className="ml-auto text-white text-opacity-70" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-primary text-white'
                        : 'text-white text-opacity-80 hover:bg-secondary-dark'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="border-t border-secondary-dark p-4">
            <button 
              onClick={handleLogout} 
              className="flex w-full items-center px-4 py-3 text-sm text-white text-opacity-80 rounded-lg hover:bg-secondary-dark"
            >
              <LogOutIcon size={20} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="text-neutral-dark md:hidden"
            >
              <MenuIcon size={24} />
            </button>
            <div className="md:hidden font-montserrat font-bold text-lg">
              Enterprise Portal
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="relative p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600" 
                onClick={() => navigate(`/${userRole}/notifications`)}
              >
                <BellIcon size={20} />
                {notificationsCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-neutral-light">
          {children}
        </main>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout;
