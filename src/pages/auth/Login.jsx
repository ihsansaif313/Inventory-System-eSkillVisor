import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, AlertCircleIcon } from 'lucide-react';
import { AuthContext } from '../../App.jsx';
import authService from '../../services/authService.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  
  const { login, isAuthenticated, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'superadmin') {
        navigate('/superadmin');
      } else if (userRole === 'manager') {
        navigate('/manager');
      } else {
        navigate('/partner');
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setLoginError('');
    setIsLoading(true);

    try {
      const result = await authService.login(email, password);
      if (result.success) {
        // Update context with user data
        login(result.user);

        // Navigate based on role
        if (result.user.role === 'super_admin') {
          navigate('/superadmin');
        } else if (result.user.role === 'manager') {
          navigate('/manager');
        } else {
          navigate('/partner');
        }
      }
    } catch (error) {
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setEmailError('');
    setLoginError('');
    setIsLoading(true);

    try {
      const result = await authService.login(demoEmail, demoPassword);
      if (result.success) {
        // Update context with user data
        login(result.user);

        // Navigate based on role
        if (result.user.role === 'super_admin') {
          navigate('/superadmin');
        } else if (result.user.role === 'manager') {
          navigate('/manager');
        } else {
          navigate('/partner');
        }
      }
    } catch (error) {
      setLoginError(error.message || 'Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@enterprise.com', password: 'password', role: 'Super Admin', description: 'Full system access' },
    { email: 'manager@enterprise.com', password: 'password', role: 'Manager', description: 'Manage partners and companies' },
    { email: 'partner@enterprise.com', password: 'password', role: 'Partner', description: 'View assigned companies' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <LockIcon className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Enterprise Portal
          </h2>
          <p className="mt-2 text-center text-sm text-white text-opacity-80">
            Sign in to your account
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                    emailError ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                  placeholder="Enter your email"
                />
              </div>
              {emailError && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircleIcon className="h-4 w-4 mr-1" />
                  {emailError}
                </div>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Login error */}
            {loginError && (
              <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircleIcon className="h-4 w-4 mr-2" />
                {loginError}
              </div>
            )}

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            {/* Demo accounts toggle */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="text-sm text-primary hover:text-primary-dark"
              >
                {showDemoAccounts ? 'Hide' : 'Show'} Demo Accounts
              </button>
            </div>
          </form>

          {/* Demo accounts */}
          {showDemoAccounts && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Demo Accounts:</h3>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => handleDemoLogin(account.email, account.password)}
                    className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{account.role}</p>
                        <p className="text-xs text-gray-500">{account.email}</p>
                      </div>
                      <p className="text-xs text-gray-400">{account.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer links */}
          <div className="mt-6 text-center">
            <a
              href="/reset-password"
              onClick={(e) => {
                e.preventDefault();
                navigate('/reset-password');
              }}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
