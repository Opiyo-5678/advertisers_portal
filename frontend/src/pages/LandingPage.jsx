import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, Star, TrendingUp, Users, 
  Target, Award, ArrowRight, Zap
} from 'lucide-react';

const LandingPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback data
  const fallbackData = {
    benefits: [
      { id: 1, title: 'Targeted Reach', icon: 'target', description: 'Reach your exact audience with precision targeting and advanced demographics' },
      { id: 2, title: 'Real-Time Analytics', icon: 'trending', description: 'Track performance with detailed real-time analytics and insights' },
      { id: 3, title: 'Expert Support', icon: 'users', description: '24/7 support from our expert team ready to help you succeed' },
    ],
    statistics: [
      { id: 1, label: 'Active Advertisers', value: '500+' },
      { id: 2, label: 'Total Impressions', value: '2M+' },
      { id: 3, label: 'Success Rate', value: '95%' },
      { id: 4, label: 'Countries', value: '50+' },
    ],
    featured_testimonials: [
      {
        id: 1,
        advertiser_name: 'John Kamau',
        company_name: 'TechCorp Kenya',
        position: 'Marketing Director',
        testimonial_text: 'AdPortal helped us increase our reach by 250% in just 3 months. The targeting options are incredible!',
        rating: 5,
        results_achieved: '250% ROI increase'
      },
      {
        id: 2,
        advertiser_name: 'Sarah Wanjiku',
        company_name: 'Retail Plus',
        position: 'CEO',
        testimonial_text: 'The best advertising platform we have used. The analytics dashboard gives us everything we need.',
        rating: 5,
        results_achieved: '50,000+ new customers'
      },
      {
        id: 3,
        advertiser_name: 'Mike Omondi',
        company_name: 'StartupHub',
        position: 'Founder',
        testimonial_text: 'Simple, effective, and affordable. Perfect for startups like ours looking to grow fast!',
        rating: 5,
        results_achieved: '10x engagement rate'
      },
    ],
  };

  useEffect(() => {
    // Try to fetch from API, use fallback if it fails
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    
    fetch(`${API_URL}/api/advertisers/marketing/overview/`)
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('Using fallback data - API not available:', err);
        setContent(fallbackData);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const iconMap = {
    target: Target,
    users: Users,
    trending: TrendingUp,
    award: Award,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-[#1E3A8A] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold text-white">AdPortal</Link>
              <div className="hidden md:flex gap-6">
                <Link to="/" className="text-cyan-300 font-semibold">Home</Link>
                <Link to="/pricing" className="text-white hover:text-cyan-300 transition-colors">Pricing</Link>
                <Link to="/faq" className="text-white hover:text-cyan-300 transition-colors">FAQ</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-white hover:text-cyan-300 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-600 transition-all shadow-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] opacity-5"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1E3A8A] mb-6 leading-tight">
              Advertise Smarter,<br />Grow Faster
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with your target audience through our powerful advertising platform. 
              Create, manage, and track your campaigns with ease.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="bg-cyan-500 text-white px-10 py-5 rounded-lg font-semibold text-lg hover:bg-cyan-600 transition-all shadow-xl hover:shadow-2xl">
                Start Free Trial
              </Link>
              <Link to="/pricing" className="border-2 border-[#1E3A8A] text-[#1E3A8A] px-10 py-5 rounded-lg font-semibold text-lg hover:bg-[#1E3A8A] hover:text-white transition-all">
                View Pricing
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {content.statistics.map(stat => (
              <div key={stat.id} className="text-center">
                <div className="text-5xl font-bold text-cyan-300 mb-2">{stat.value}</div>
                <div className="text-gray-200 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1E3A8A] mb-4">Why Choose AdPortal</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to launch successful advertising campaigns
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {content.benefits.map(benefit => {
              const IconComponent = iconMap[benefit.icon] || Target;
              return (
                <div key={benefit.id} className="text-center p-8 rounded-xl hover:shadow-2xl transition-all border border-gray-100">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-100 rounded-2xl mb-6">
                    <IconComponent className="w-10 h-10 text-cyan-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing CTA Section - NEW! */}
      <section className="bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Zap className="w-5 h-5 text-cyan-300" />
              <span className="text-sm font-semibold">Flexible Plans for Every Business</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h2>
            
            <p className="text-xl text-gray-200 mb-10 leading-relaxed">
              Choose the perfect plan for your business needs. From startups to enterprises, 
              we have pricing options that scale with your growth. No hidden fees, cancel anytime.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link 
                to="/pricing" 
                className="bg-cyan-500 text-white px-10 py-5 rounded-lg font-semibold text-lg hover:bg-cyan-600 transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-2"
              >
                View All Pricing Plans
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-[#1E3A8A] px-10 py-5 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
              >
                Start Free Trial
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-300" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-300" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-300" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1E3A8A] mb-4">Trusted by Leading Businesses</h2>
            <p className="text-xl text-gray-600">See what our clients have to say</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {content.featured_testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-100">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-cyan-500 text-cyan-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                  "{testimonial.testimonial_text}"
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-[#1E3A8A]">{testimonial.advertiser_name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial.position}, {testimonial.company_name}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm font-semibold text-cyan-600 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {testimonial.results_achieved}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1E3A8A] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful advertisers and start reaching your target audience today
          </p>
          <Link to="/register" className="inline-block bg-cyan-500 text-white px-10 py-5 rounded-lg font-semibold text-lg hover:bg-cyan-600 transition-all shadow-xl hover:shadow-2xl">
            Create Your Free Account
          </Link>
          <p className="mt-4 text-gray-300">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F1F47] text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
                <li><Link to="/faq" className="hover:text-cyan-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/faq" className="hover:text-cyan-400 transition-colors">FAQ</Link></li>
                <li><Link to="/help" className="hover:text-cyan-400 transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-sm">© 2025 AdPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;