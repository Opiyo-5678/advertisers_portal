import { useNavigate } from 'react-router-dom';
import Accordion from '../components/Accordion';

const LandingPage = () => {
  const navigate = useNavigate();

  // Placeholder accordion content (Lorem ipsum)
  const accordionItems = [
    {
      title: "What is the Advertiser Portal?",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      title: "How to Get Started",
      content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
    },
    {
      title: "Advertising Features",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis."
    },
    {
      title: "Pricing & Packages",
      content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    },
    {
      title: "Calendar Booking System",
      content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      title: "Support & Resources",
      content: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* TOP: Title and Subtitle */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-8 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Advertiser Portal
          </h1>
          <p className="text-lg text-blue-100">
            Manage your advertising bookings online
          </p>
        </div>

        {/* SPLIT CONTENT */}
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          
          {/* LEFT SIDE: Accordion */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Information & Features
            </h2>
            <Accordion items={accordionItems} />
          </div>

          {/* RIGHT SIDE: Buttons */}
          <div className="flex flex-col justify-center gap-6">
            
            {/* Sign Up and Login - Horizontal */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-4 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
              >
                Login
              </button>
            </div>

            {/* View Demo - Full Width */}
            <button
              onClick={() => navigate('/demo-login')}
              className="w-full px-6 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg"
            >
              View Demo
            </button>

            {/* Info Text */}
            <p className="text-center text-gray-600 text-sm">
              Explore all features without registration
            </p>

            {/* Additional Information Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Why Choose Us?</h3>
              <p className="text-sm text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Professional advertising management platform with calendar booking and secure file uploads.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 text-center py-4 text-sm text-gray-600 border-t">
          © 2025 Advertiser Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LandingPage;