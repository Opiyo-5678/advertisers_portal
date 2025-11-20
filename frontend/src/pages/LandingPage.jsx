import { useNavigate } from 'react-router-dom';
import Accordion from '../components/Accordion';

const LandingPage = () => {
  const navigate = useNavigate();

  // Placeholder accordion content (Lorem ipsum)
  const accordionItems = [
  {
    title: "What is the Advertiser Portal?",
    content: "The Advertiser Portal is your complete solution for managing online advertising campaigns. Create professional ads with images and content, book advertising placements through our calendar system, and track your campaign performance with built-in analytics. Everything you need to run successful advertising campaigns in one place."
  },
  {
    title: "How to Get Started",
    content: "Getting started is simple. First, create your free account by clicking 'Sign Up'. Once registered, you can immediately begin creating your first advertisement by uploading images, adding your content, and including website links. After your ad is approved, browse available advertising slots in our calendar and book the dates that work best for your campaign."
  },
  {
    title: "Advertising Features",
    content: "Our platform offers powerful features to make your advertising effective. Upload multiple images with automatic malware scanning for security. Add rich text descriptions and compelling calls-to-action. Include links to your website and product catalogs. Choose between simple webflyer-style ads or detailed full-format advertisements with complete information."
  },
  {
    title: "Pricing & Packages",
    content: "We offer flexible pricing to suit businesses of all sizes. Advertising packages are available with monthly, quarterly, and yearly billing options. All ads require a minimum 3-month commitment to ensure consistent campaign visibility. Browse our pricing page to find the perfect package for your advertising budget and goals."
  },
  {
    title: "Calendar Booking System",
    content: "Our intuitive calendar system makes booking advertising slots effortless. View available dates in real-time, check placement availability, and reserve your preferred time slots instantly. The calendar shows all confirmed bookings, prevents double-booking conflicts, and lets you manage multiple campaigns simultaneously. Choose between main placements or regional targeting for your ads."
  },
  {
    title: "Support & Resources",
    content: "We're here to help you succeed. Access our comprehensive FAQ section for quick answers to common questions. Need personalized assistance? Our support team is available through the messaging system in your dashboard. All ads go through a review process to ensure quality, and we'll guide you through any needed revisions to get your campaigns live quickly."
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
                Professional advertising management platform with secure file uploads, calendar-based booking, 
    real-time availability checking, and comprehensive campaign analytics. Start advertising smarter today.
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