import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, AlertCircleIcon } from 'lucide-react';
import { AuthContext } from '../../App';
import FloatingParticles from '../../components/ui/FloatingParticles';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const {
    login,
    isAuthenticated,
    userRole
  } = useContext(AuthContext);
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
  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const handleSubmit = e => {
    e.preventDefault();
    // Email validation
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setLoginError('');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const loginSuccess = login(email, password);
      setIsLoading(false);
      if (!loginSuccess) {
        setLoginError('Invalid email or password');
      }
    }, 1500);
  };
  const setDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setShowDemoAccounts(false);
  };
  return <div className="min-h-screen w-full gradient-bg flex items-center justify-center relative overflow-hidden">
      <FloatingParticles />
      <div className="glass-card w-full max-w-md p-8 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Enterprise Portal
          </h1>
          <p className="text-white text-opacity-80">Sign in to your account</p>
        </div>
        {loginError && <div className="mb-6 p-3 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg text-white flex items-center">
            <AlertCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{loginError}</span>
          </div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-white text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-white text-opacity-70" />
              </div>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10 bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-60" placeholder="your.email@company.com" autoComplete="email" />
            </div>
            {emailError && <p className="text-red-300 text-sm mt-1">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-white text-sm font-medium">
                Password
              </label>
              <a href="/reset-password" className="text-sm text-primary hover:text-primary-light transition-colors">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-white text-opacity-70" />
              </div>
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-10 pr-10 bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-60" placeholder="••••••••" />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon className="h-5 w-5 text-white text-opacity-70" /> : <EyeIcon className="h-5 w-5 text-white text-opacity-70" />}
              </button>
            </div>
          </div>
          <button type="submit" className={`btn-primary w-full flex items-center justify-center ${isLoading ? 'opacity-80' : ''}`} disabled={isLoading}>
            {isLoading ? <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div> : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => setShowDemoAccounts(!showDemoAccounts)} className="text-white text-opacity-80 text-sm hover:text-opacity-100 transition-opacity">
            {showDemoAccounts ? 'Hide Demo Accounts' : 'Show Demo Accounts'}
          </button>
          {showDemoAccounts && <div className="mt-4 space-y-3 text-left bg-white bg-opacity-10 p-4 rounded-lg">
              <div>
                <h3 className="text-white font-medium mb-2">Demo Accounts:</h3>
                <div className="space-y-2">
                  <button onClick={() => setDemoAccount('admin@enterprise.com', 'admin123')} className="w-full text-left p-2 text-sm bg-white bg-opacity-10 hover:bg-opacity-20 rounded transition-all text-white">
                    <div className="font-medium">Super Admin</div>
                    <div className="text-xs text-white text-opacity-70">
                      admin@enterprise.com / admin123
                    </div>
                  </button>
                  <button onClick={() => setDemoAccount('manager@enterprise.com', 'manager123')} className="w-full text-left p-2 text-sm bg-white bg-opacity-10 hover:bg-opacity-20 rounded transition-all text-white">
                    <div className="font-medium">Manager</div>
                    <div className="text-xs text-white text-opacity-70">
                      manager@enterprise.com / manager123
                    </div>
                  </button>
                  <button onClick={() => setDemoAccount('partner@enterprise.com', 'partner123')} className="w-full text-left p-2 text-sm bg-white bg-opacity-10 hover:bg-opacity-20 rounded transition-all text-white">
                    <div className="font-medium">Partner</div>
                    <div className="text-xs text-white text-opacity-70">
                      partner@enterprise.com / partner123
                    </div>
                  </button>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default Login;