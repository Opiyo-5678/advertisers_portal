import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Link2, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  History, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Upload className="w-5 h-5" />, text: "Upload files with malware protection" },
    { icon: <FileText className="w-5 h-5" />, text: "Write ad content using text editor" },
    { icon: <Link2 className="w-5 h-5" />, text: "Add links to your website/catalogs" },
    { icon: <Calendar className="w-5 h-5" />, text: "Check availability using calendar" },
    { icon: <CheckCircle2 className="w-5 h-5" />, text: "Browse available ad placements" },
    { icon: <CreditCard className="w-5 h-5" />, text: "Make and track payments" },
    { icon: <History className="w-5 h-5" />, text: "View your booking history" },
    { icon: <BarChart3 className="w-5 h-5" />, text: "See analytics and statistics" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 min-h-[600px]">
            
            {/* LEFT SIDE - Eye-catching Description */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex flex-col justify-center text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Modern Advertising Platform</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Advertiser
                  <span className="block text-blue-200">Portal</span>
                </h1>

                {/* Tagline */}
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Manage your advertising bookings online with ease. 
                  Everything you need in one powerful platform.
                </p>

                {/* Key Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-blue-50">No paperwork, fully automated</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-blue-50">Real-time availability checking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-blue-50">Secure payment tracking</span>
                  </div>
                </div>

                {/* Bottom decoration */}
                <div className="mt-12 flex items-center gap-2 text-blue-100">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-white/30 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-white/30 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-white/30 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-sm">Trusted by businesses</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Buttons and Features */}
            <div className="p-12 flex flex-col justify-between">
              
              {/* Top Section - Auth Buttons */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Get Started
                </h2>
                
                {/* Sign Up Button */}
                <button
                  onClick={() => navigate('/register')}
                  className="w-full group px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-between"
                >
                  <span>Sign Up Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Login Button */}
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all border-2 border-gray-200"
                >
                  Login
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="text-sm text-gray-500">or</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Demo Button */}
                <button
                  onClick={() => navigate('/demo-login')}
                  className="w-full group px-6 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Try Demo (No Registration)</span>
                </button>

                <p className="text-center text-sm text-gray-500 mt-2">
                  Explore all features instantly
                </p>
              </div>

              {/* Bottom Section - Features List */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What you can do:
                </h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/80">
          <p className="text-sm">© 2025 Advertiser Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;