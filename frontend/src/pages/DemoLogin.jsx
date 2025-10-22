import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DemoLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Logging in as demo user...');

  useEffect(() => {
    const loginAsDemo = async () => {
      try {
        setStatus('Logging in as demo user...');
        
        // Use AuthContext's login function
        const result = await login('demo', 'demo123');
        
        if (result.success) {
          setStatus('Success! Redirecting to dashboard...');
          
          // Redirect to dashboard
          setTimeout(() => {
            navigate('/dashboard');
          }, 500);
        } else {
          setStatus('Demo login failed. Redirecting to login page...');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
        
      } catch (error) {
        console.error('Demo login error:', error);
        setStatus('Demo login failed. Redirecting to login page...');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    loginAsDemo();
  }, [login, navigate]);

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