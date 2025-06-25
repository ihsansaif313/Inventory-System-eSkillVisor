import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockIcon, CheckCircleIcon } from 'lucide-react';
import FloatingParticles from '../../components/ui/FloatingParticles';
const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();
  // Simple password strength calculator
  const calculateStrength = password => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };
  const handlePasswordChange = e => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(calculateStrength(password));
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (passwordStrength < 3) {
      setError('Password is not strong enough');
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // Redirect to login after successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }, 1500);
  };
  // Session timeout counter
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/login');
    }
  }, [remainingTime, navigate]);
  // Format time as MM:SS
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  return <div className="min-h-screen w-full gradient-bg flex items-center justify-center relative overflow-hidden">
      <FloatingParticles />
      <div className="glass-card w-full max-w-md p-8 z-10">
        {!isSuccess ? <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Reset Password
              </h1>
              <p className="text-white text-opacity-80">
                Create a new secure password
              </p>
              <div className="mt-2 text-white text-opacity-70 text-sm">
                Session expires in:{' '}
                <span className="font-medium">{formatTime(remainingTime)}</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-white text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-white text-opacity-70" />
                  </div>
                  <input id="newPassword" type="password" value={newPassword} onChange={handlePasswordChange} className="input-field pl-10 bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-60" placeholder="Enter new password" />
                </div>
                {/* Password strength indicator */}
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-white text-opacity-80 text-xs">
                      Password Strength
                    </span>
                    <span className="text-white text-opacity-80 text-xs">
                      {passwordStrength === 0 && 'Very Weak'}
                      {passwordStrength === 1 && 'Weak'}
                      {passwordStrength === 2 && 'Fair'}
                      {passwordStrength === 3 && 'Good'}
                      {passwordStrength === 4 && 'Strong'}
                      {passwordStrength === 5 && 'Very Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div className={`h-2 rounded-full ${passwordStrength <= 1 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{
                  width: `${passwordStrength / 5 * 100}%`
                }}></div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-white text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-white text-opacity-70" />
                  </div>
                  <input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field pl-10 bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-60" placeholder="Confirm new password" />
                </div>
              </div>
              {error && <p className="text-red-300 text-sm">{error}</p>}
              <button type="submit" className={`btn-primary w-full flex items-center justify-center ${isLoading ? 'opacity-80' : ''}`} disabled={isLoading}>
                {isLoading ? <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </div> : 'Reset Password'}
              </button>
            </form>
          </> : <div className="text-center py-8">
            <div className="mb-6 flex justify-center">
              <CheckCircleIcon className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Password Updated!
            </h2>
            <p className="text-white text-opacity-80 mb-6">
              Your password has been successfully reset.
            </p>
            <p className="text-white text-opacity-70 text-sm">
              Redirecting to login page...
            </p>
          </div>}
      </div>
    </div>;
};
export default PasswordReset;