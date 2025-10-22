import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Link, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  History, 
  CheckCircle2,
  Sparkles 
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload Files Securely",
      description: "Upload logos and advertising files with malware protection"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Rich Text Editor",
      description: "Write ad content using our powerful text editor"
    },
    {
      icon: <Link className="w-6 h-6" />,
      title: "Link Management",
      description: "Add links to your website and catalogs"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Calendar Booking",
      description: "Check availability and book slots using our calendar"
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "Browse Placements",
      description: "Explore available advertising placements"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Payment Tracking",
      description: "Make and track all your payments"
    },
    {
      icon: <History className="w-6 h-6" />,
      title: "Booking History",
      description: "View your complete booking history"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "See detailed analytics and statistics"
    }
  ];

  const handleDemoLogin = () => {
    navigate('/demo-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Modern Advertising Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Advertiser Portal
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Manage your advertising bookings online with ease
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={handleDemoLogin}
              className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Try Demo (No Registration)
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 shadow-xl"
            >
              Sign Up Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Login
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
            Everything You Need
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Powerful features to manage your advertising campaigns
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-blue-100 hover:border-blue-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Demo account available - explore all features instantly</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-blue-100">
          <p className="text-sm">
            © 2025 Advertiser Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;