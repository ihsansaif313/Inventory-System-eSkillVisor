import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import authService from './services/authService.js';
import Login from './pages/auth/Login.jsx';
import PasswordReset from './pages/auth/PasswordReset.jsx';
import SuperadminDashboard from './pages/superadmin/Dashboard.jsx';
import ManagerDashboard from './pages/manager/Dashboard.jsx';
import PartnerDashboard from './pages/partner/Dashboard.jsx';
import UserManagement from './pages/superadmin/UserManagement.jsx';
import CompanyOversight from './pages/superadmin/CompanyOversight.jsx';
import SuperadminInventory from './pages/superadmin/Inventory.jsx';
import PartnerManagement from './pages/manager/PartnerManagement.jsx';
import CompanyManagement from './pages/manager/CompanyManagement.jsx';
import ManagerInventory from './pages/manager/Inventory.jsx';
import PartnerCompanyList from './pages/partner/CompanyList.jsx';
import PartnerCompanyView from './pages/partner/CompanyView.jsx';
import PartnerInventory from './pages/partner/Inventory.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import NotificationsPage from './pages/notifications/NotificationsPage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';

// Authentication context
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  userRole: null,
  userEmail: '',
  login: () => {},
  logout: () => {}
});

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state from stored token
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          await authService.initializeFromToken();
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setIsAuthenticated(true);
            setUser(currentUser);
            setUserRole(currentUser.role);
            setUserEmail(currentUser.email);
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setUserRole(userData.role);
    setUserEmail(userData.email);
    return true;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      setUserEmail('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Protected route component
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'super_admin') {
        return <Navigate to="/superadmin" replace />;
      } else if (userRole === 'manager') {
        return <Navigate to="/manager" replace />;
      } else {
        return <Navigate to="/partner" replace />;
      }
    }

    return children;
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requiredRole: PropTypes.oneOf(['super_admin', 'manager', 'partner'])
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      userRole,
      userEmail,
      login,
      logout
    }}>
      <BrowserRouter>
        <Routes>
          {/* Root route - redirect based on authentication */}
          <Route path="/" element={
            isAuthenticated ? (
              userRole === 'super_admin' ? <Navigate to="/superadmin" replace /> :
              userRole === 'manager' ? <Navigate to="/manager" replace /> :
              <Navigate to="/partner" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<PasswordReset />} />

          {/* SuperAdmin routes */}
          <Route path="/superadmin" element={
            <ProtectedRoute requiredRole="super_admin">
              <MainLayout>
                <SuperadminDashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/superadmin/users" element={
            <ProtectedRoute requiredRole="super_admin">
              <MainLayout>
                <UserManagement />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/superadmin/companies" element={
            <ProtectedRoute requiredRole="super_admin">
              <MainLayout>
                <CompanyOversight />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/superadmin/inventory" element={
            <ProtectedRoute requiredRole="super_admin">
              <MainLayout>
                <SuperadminInventory />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/superadmin/notifications" element={
            <ProtectedRoute requiredRole="super_admin">
              <MainLayout>
                <NotificationsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/superadmin/settings" element={
            <ProtectedRoute requiredRole="super_admin">
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Manager routes */}
          <Route path="/manager" element={
            <ProtectedRoute requiredRole="manager">
              <MainLayout>
                <ManagerDashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/partners" element={
            <ProtectedRoute requiredRole="manager">
              <MainLayout>
                <PartnerManagement />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/companies" element={
            <ProtectedRoute requiredRole="manager">
              <MainLayout>
                <CompanyManagement />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/inventory" element={
            <ProtectedRoute requiredRole="manager">
              <MainLayout>
                <ManagerInventory />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/notifications" element={
            <ProtectedRoute requiredRole="manager">
              <MainLayout>
                <NotificationsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/settings" element={
            <ProtectedRoute requiredRole="manager">
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Partner routes */}
          <Route path="/partner" element={
            <ProtectedRoute requiredRole="partner">
              <MainLayout>
                <PartnerDashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/partner/companies" element={
            <ProtectedRoute requiredRole="partner">
              <MainLayout>
                <PartnerCompanyList />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/partner/company/:id" element={
            <ProtectedRoute requiredRole="partner">
              <MainLayout>
                <PartnerCompanyView />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/partner/inventory" element={
            <ProtectedRoute requiredRole="partner">
              <MainLayout>
                <PartnerInventory />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/partner/notifications" element={
            <ProtectedRoute requiredRole="partner">
              <MainLayout>
                <NotificationsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/partner/settings" element={
            <ProtectedRoute requiredRole="partner">
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
