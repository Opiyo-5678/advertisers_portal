import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const DemoLogin = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Logging in as demo user...');

  useEffect(() => {
    const loginAsDemo = async () => {
      try {
        setStatus('Logging in as demo user...');
        
        // Login with demo credentials using direct axios call
        const response = await axios.post('/api/accounts/auth/login/', {
          username: 'demo',
          password: 'demo123'
        });
        
        // Store tokens in cookies
        Cookies.set('access_token', response.data.access, { expires: 7 });
        Cookies.set('refresh_token', response.data.refresh, { expires: 7 });
        
        setStatus('Success! Redirecting to dashboard...');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
        
      } catch (error) {
        console.error('Demo login error:', error);
        setStatus('Demo login failed. Please try again or use manual login.');
        
        // Redirect to login page after delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    loginAsDemo();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        {/* Loading Spinner */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
        
        {/* Status Message */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {status}
        </h2>
        
        <p className="text-gray-600 text-sm">
          Please wait a moment...
        </p>
      </div>
    </div>
  );
};

export default DemoLogin;