import React, { useState } from 'react';
import { UserIcon, MailIcon, LockIcon, BellIcon, GlobeIcon, ShieldIcon, SaveIcon } from 'lucide-react';
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@enterprise.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Senior Manager'
  });
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    approvalAlerts: true,
    newUserAlerts: false,
    systemUpdates: true
  });
  const handleProfileChange = e => {
    const {
      name,
      value
    } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  const handleSecurityChange = e => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setSecurityData({
      ...securityData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const handleNotificationChange = e => {
    const {
      name,
      checked
    } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  const handleProfileSubmit = e => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log('Updating profile:', profileData);
    alert('Profile updated successfully!');
  };
  const handleSecuritySubmit = e => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log('Updating security settings:', securityData);
    alert('Security settings updated successfully!');
    setSecurityData({
      ...securityData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  const handleNotificationSubmit = e => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log('Updating notification settings:', notificationSettings);
    alert('Notification settings updated successfully!');
  };
  return <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Settings</h1>
        <p className="text-neutral-dark text-opacity-70">
          Manage your account settings and preferences
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200">
            <nav className="space-y-1">
              <button className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setActiveTab('profile')}>
                <UserIcon size={18} className="mr-3" />
                Profile Information
              </button>
              <button className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${activeTab === 'security' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setActiveTab('security')}>
                <ShieldIcon size={18} className="mr-3" />
                Security
              </button>
              <button className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${activeTab === 'notifications' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setActiveTab('notifications')}>
                <BellIcon size={18} className="mr-3" />
                Notifications
              </button>
            </nav>
          </div>
          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && <div>
                <h2 className="text-xl font-bold text-neutral-dark mb-6">
                  Profile Information
                </h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input type="text" id="firstName" name="firstName" value={profileData.firstName} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" required />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input type="text" id="lastName" name="lastName" value={profileData.lastName} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon size={18} className="text-gray-400" />
                      </div>
                      <input type="email" id="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input type="tel" id="phone" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input type="text" id="jobTitle" name="jobTitle" value={profileData.jobTitle} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="btn-primary flex items-center">
                      <SaveIcon size={18} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>}
            {activeTab === 'security' && <div>
                <h2 className="text-xl font-bold text-neutral-dark mb-6">
                  Security Settings
                </h2>
                <form onSubmit={handleSecuritySubmit} className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockIcon size={18} className="text-gray-400" />
                      </div>
                      <input type="password" id="currentPassword" name="currentPassword" value={securityData.currentPassword} onChange={handleSecurityChange} className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input type="password" id="newPassword" name="newPassword" value={securityData.newPassword} onChange={handleSecurityChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" required />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={securityData.confirmPassword} onChange={handleSecurityChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" required />
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="twoFactorEnabled" name="twoFactorEnabled" checked={securityData.twoFactorEnabled} onChange={handleSecurityChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    <label htmlFor="twoFactorEnabled" className="ml-2 block text-sm text-gray-700">
                      Enable two-factor authentication
                    </label>
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="btn-primary flex items-center">
                      <SaveIcon size={18} className="mr-2" />
                      Update Password
                    </button>
                  </div>
                </form>
              </div>}
            {activeTab === 'notifications' && <div>
                <h2 className="text-xl font-bold text-neutral-dark mb-6">
                  Notification Preferences
                </h2>
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="checkbox" id="emailNotifications" name="emailNotifications" checked={notificationSettings.emailNotifications} onChange={handleNotificationChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                          Email Notifications
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">
                        Receive notifications via email
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="checkbox" id="pushNotifications" name="pushNotifications" checked={notificationSettings.pushNotifications} onChange={handleNotificationChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700">
                          Push Notifications
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">
                        Receive notifications in the browser
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Notification Types
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input type="checkbox" id="approvalAlerts" name="approvalAlerts" checked={notificationSettings.approvalAlerts} onChange={handleNotificationChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                          <label htmlFor="approvalAlerts" className="ml-2 block text-sm text-gray-700">
                            Approval Alerts
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="newUserAlerts" name="newUserAlerts" checked={notificationSettings.newUserAlerts} onChange={handleNotificationChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                          <label htmlFor="newUserAlerts" className="ml-2 block text-sm text-gray-700">
                            New User Alerts
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="systemUpdates" name="systemUpdates" checked={notificationSettings.systemUpdates} onChange={handleNotificationChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                          <label htmlFor="systemUpdates" className="ml-2 block text-sm text-gray-700">
                            System Updates
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="btn-primary flex items-center">
                      <SaveIcon size={18} className="mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default SettingsPage;