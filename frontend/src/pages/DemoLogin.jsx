import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Link2, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  History, 
  CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Upload className="w-5 h-5" />, text: "Upload logos and advertising files (with malware protection)" },
    { icon: <FileText className="w-5 h-5" />, text: "Write ad content using text editor" },
    { icon: <Link2 className="w-5 h-5" />, text: "Add links to your website/catalogs" },
    { icon: <Calendar className="w-5 h-5" />, text: "Browse available advertising placements" },
    { icon: <CheckCircle2 className="w-5 h-5" />, text: "Check availability using calendar" },
    { icon: <CreditCard className="w-5 h-5" />, text: "Book advertising slots for specific periods" },
    { icon: <BarChart3 className="w-5 h-5" />, text: "Make and track payments" },
    { icon: <History className="w-5 h-5" />, text: "View your booking history" },
    { icon: <CheckCircle2 className="w-5 h-5" />, text: "See analytics and statistics" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-6">
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
          
          {/* LEFT SIDE: Features List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What you can do after registering:
            </h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {feature.icon}
                  </div>
                  <span className="text-gray-700 pt-2">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
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

            {/* Try Demo - Full Width */}
            <button
              onClick={() => navigate('/demo-login')}
              className="w-full px-6 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Try Demo (No Registration)
            </button>

            {/* Info Text */}
            <p className="text-center text-gray-600 text-sm">
              Demo account lets you explore all features without registration
            </p>
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