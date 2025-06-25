import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import PasswordReset from './pages/auth/PasswordReset';
import SuperadminDashboard from './pages/superadmin/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import PartnerDashboard from './pages/partner/Dashboard';
import UserManagement from './pages/superadmin/UserManagement';
import CompanyOversight from './pages/superadmin/CompanyOversight';
import PartnerManagement from './pages/manager/PartnerManagement';
import CompanyManagement from './pages/manager/CompanyManagement';
import PartnerCompanyList from './pages/partner/CompanyList';
import PartnerCompanyView from './pages/partner/CompanyView';
import MainLayout from './components/layout/MainLayout';
import NotificationsPage from './pages/notifications/NotificationsPage';
import SettingsPage from './pages/settings/SettingsPage';
// Demo accounts
const demoAccounts = {
  'admin@enterprise.com': {
    password: 'admin123',
    role: 'superadmin'
  },
  'manager@enterprise.com': {
    password: 'manager123',
    role: 'manager'
  },
  'partner@enterprise.com': {
    password: 'partner123',
    role: 'partner'
  }
};
// Mock authentication context - would be replaced with a proper auth system
export const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null,
  userEmail: '',
  login: (email, password) => {},
  logout: () => {}
});
export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const login = (email, password) => {
    // Check if email exists in demo accounts
    if (demoAccounts[email] && demoAccounts[email].password === password) {
      setIsAuthenticated(true);
      setUserRole(demoAccounts[email].role);
      setUserEmail(email);
      return true;
    }
    // For other emails, use the pattern-based role detection
    if (email.includes('admin')) {
      setIsAuthenticated(true);
      setUserRole('superadmin');
      setUserEmail(email);
      return true;
    } else if (email.includes('manager')) {
      setIsAuthenticated(true);
      setUserRole('manager');
      setUserEmail(email);
      return true;
    } else if (email.includes('partner')) {
      setIsAuthenticated(true);
      setUserRole('partner');
      setUserEmail(email);
      return true;
    }
    return false;
  };
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail('');
  };
  // Protected route component
  const ProtectedRoute = ({
    children,
    requiredRole
  }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'superadmin') {
        return <Navigate to="/superadmin" replace />;
      } else if (userRole === 'manager') {
        return <Navigate to="/manager" replace />;
      } else {
        return <Navigate to="/partner" replace />;
      }
    }
    return children;
  };
  return <AuthContext.Provider value={{
    isAuthenticated,
    userRole,
    userEmail,
    login,
    logout
  }}>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          {/* SuperAdmin routes */}
          <Route path="/superadmin" element={<ProtectedRoute requiredRole="superadmin">
                <MainLayout>
                  <SuperadminDashboard />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/superadmin/users" element={<ProtectedRoute requiredRole="superadmin">
                <MainLayout>
                  <UserManagement />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/superadmin/companies" element={<ProtectedRoute requiredRole="superadmin">
                <MainLayout>
                  <CompanyOversight />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/superadmin/notifications" element={<ProtectedRoute requiredRole="superadmin">
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/superadmin/settings" element={<ProtectedRoute requiredRole="superadmin">
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </ProtectedRoute>} />
          {/* Manager routes */}
          <Route path="/manager" element={<ProtectedRoute requiredRole="manager">
                <MainLayout>
                  <ManagerDashboard />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/manager/partners" element={<ProtectedRoute requiredRole="manager">
                <MainLayout>
                  <PartnerManagement />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/manager/companies" element={<ProtectedRoute requiredRole="manager">
                <MainLayout>
                  <CompanyManagement />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/manager/notifications" element={<ProtectedRoute requiredRole="manager">
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/manager/settings" element={<ProtectedRoute requiredRole="manager">
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </ProtectedRoute>} />
          {/* Partner routes */}
          <Route path="/partner" element={<ProtectedRoute requiredRole="partner">
                <MainLayout>
                  <PartnerDashboard />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/partner/companies" element={<ProtectedRoute requiredRole="partner">
                <MainLayout>
                  <PartnerCompanyList />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/partner/company/:id" element={<ProtectedRoute requiredRole="partner">
                <MainLayout>
                  <PartnerCompanyView />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/partner/notifications" element={<ProtectedRoute requiredRole="partner">
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              </ProtectedRoute>} />
          <Route path="/partner/settings" element={<ProtectedRoute requiredRole="partner">
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </ProtectedRoute>} />
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>;
}