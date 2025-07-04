import React, { useState, useContext } from 'react';
import { UserIcon, BellIcon, ShieldIcon, DatabaseIcon } from 'lucide-react';
import { AuthContext } from '../../App.jsx';

const SettingsPage = () => {
  const { userEmail, userRole } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    lowStockAlerts: true,
    weeklyReports: true,
    theme: 'light',
    language: 'en'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const SettingSection = ({ title, icon, children }) => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-lg mr-3">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const ToggleSetting = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and system settings</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <SettingSection
          title="Profile"
          icon={<UserIcon className="h-5 w-5 text-gray-600" />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={userEmail}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                value={userRole}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
              />
            </div>
          </div>
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection
          title="Notifications"
          icon={<BellIcon className="h-5 w-5 text-gray-600" />}
        >
          <div className="space-y-1">
            <ToggleSetting
              label="Email Notifications"
              description="Receive notifications via email"
              checked={settings.emailNotifications}
              onChange={(value) => handleSettingChange('emailNotifications', value)}
            />
            <ToggleSetting
              label="Push Notifications"
              description="Receive browser push notifications"
              checked={settings.pushNotifications}
              onChange={(value) => handleSettingChange('pushNotifications', value)}
            />
            <ToggleSetting
              label="Low Stock Alerts"
              description="Get notified when inventory is running low"
              checked={settings.lowStockAlerts}
              onChange={(value) => handleSettingChange('lowStockAlerts', value)}
            />
            <ToggleSetting
              label="Weekly Reports"
              description="Receive weekly inventory summary reports"
              checked={settings.weeklyReports}
              onChange={(value) => handleSettingChange('weeklyReports', value)}
            />
          </div>
        </SettingSection>

        {/* Security Settings */}
        <SettingSection
          title="Security"
          icon={<ShieldIcon className="h-5 w-5 text-gray-600" />}
        >
          <div className="space-y-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Change Password
            </button>
            <div>
              <p className="text-sm text-gray-600">
                Last login: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </SettingSection>

        {/* System Settings (Admin only) */}
        {(userRole === 'superadmin' || userRole === 'manager') && (
          <SettingSection
            title="System"
            icon={<DatabaseIcon className="h-5 w-5 text-gray-600" />}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Default File Upload Size Limit</label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option>10 MB</option>
                  <option>25 MB</option>
                  <option>50 MB</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data Retention Period</label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option>1 Year</option>
                  <option>2 Years</option>
                  <option>5 Years</option>
                </select>
              </div>
            </div>
          </SettingSection>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
