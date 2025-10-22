import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services';
import Cookies from 'js-cookie';

const DemoLogin = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Logging in as demo user...');

  useEffect(() => {
    const loginAsDemo = async () => {
      try {
        // Login with demo credentials
        const response = await authAPI.login('demo', 'demo123');
        
        // Store tokens
        Cookies.set('access_token', response.data.access);
        Cookies.set('refresh_token', response.data.refresh);
        
        setStatus('Success! Redirecting...');
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } catch (error) {
        setStatus('Demo login failed. Redirecting to login page...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    };

    loginAsDemo();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
};

export default DemoLogin;