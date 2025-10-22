import React, { useState, useEffect } from 'react';
import { Check, X, Star, Zap, ArrowRight } from 'lucide-react';

const PricingPage = () => {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/advertisers/marketing/enhanced-pricing/comparison/')
      .then(res => res.json())
      .then(data => {
        setPricingData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-xl text-gray-600">Loading pricing...</div>
      </div>
    );
  }

  if (!pricingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-red-600">Failed to load pricing</div>
      </div>
    );
  }

  const { packages, all_features } = pricingData;

  // ✨ FALLBACK FEATURES - Shows if backend doesn't provide features
  const fallbackFeatures = [
    { id: 1, name: 'Active Ads', description: 'Number of simultaneously active advertisements' },
    { id: 2, name: 'Monthly Impressions', description: 'Total ad views per month' },
    { id: 3, name: 'Ad Creation Tools', description: 'File upload, text editor, link management' },
    { id: 4, name: 'Calendar Scheduling', description: 'Visual booking calendar for campaigns' },
    { id: 5, name: 'Analytics Dashboard', description: 'View clicks, impressions, and CTR' },
    { id: 6, name: 'Advanced Reporting', description: 'Export detailed performance reports' },
    { id: 7, name: 'A/B Testing', description: 'Test multiple ad variations' },
    { id: 8, name: 'Target Audience', description: 'Demographics and location targeting' },
    { id: 9, name: 'Priority Support', description: 'Email and chat support response time' },
    { id: 10, name: 'API Access', description: 'Programmatic ad management' },
    { id: 11, name: 'White Label', description: 'Remove AdPortal branding' },
    { id: 12, name: 'Dedicated Account Manager', description: 'Personal support contact' }
  ];

  // Use backend features if available, otherwise use fallback
  const features = (all_features && all_features.length > 0) ? all_features : fallbackFeatures;

  const getFeatureForPackage = (pkg, featureName) => {
    return pkg.package_features.find(pf => pf.feature_name === featureName);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Navy Blue Header */}
      <nav className="bg-[#1E3A8A] shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-white">AdPortal</h1>
              <div className="hidden md:flex gap-6">
                <a href="/" className="text-white hover:text-cyan-300 transition-colors">Home</a>
                <a href="/pricing" className="text-cyan-300 font-semibold">Pricing</a>
                <a href="/faq" className="text-white hover:text-cyan-300 transition-colors">FAQ</a>
                <a href="/case-studies" className="text-white hover:text-cyan-300 transition-colors">Success Stories</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-cyan-300 transition-colors">
                Sign In
              </button>
              <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-600 transition-all shadow-lg">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header - Navy Background */}
      <section className="bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your business needs. No hidden fees, cancel anytime.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
            <Check className="w-5 h-5 text-cyan-300" />
            <span className="text-white">14-day free trial • No credit card required</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 -mt-10 mb-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map(pkg => (
            <div 
              key={pkg.id}
              className={`bg-white rounded-2xl p-8 ${
                pkg.is_popular 
                  ? 'ring-2 ring-cyan-500 shadow-2xl transform scale-105 relative' 
                  : 'shadow-lg hover:shadow-xl transition-shadow'
              }`}
            >
              {pkg.is_popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Star className="w-4 h-4 fill-white" />
                    <span className="font-semibold">Most Popular</span>
                  </div>
                </div>
              )}
              
              {pkg.is_featured && !pkg.is_popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#1E3A8A] text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold">Best Value</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-6 mt-4">
                <h3 className="text-2xl font-bold text-[#1E3A8A] mb-2">{pkg.name}</h3>
                {pkg.tagline && (
                  <p className="text-gray-600">{pkg.tagline}</p>
                )}
              </div>

              <div className="text-center mb-8">
                {pkg.is_enterprise ? (
                  <div className="text-4xl font-bold text-[#1E3A8A]">Contact Us</div>
                ) : (
                  <>
                    {pkg.original_price && (
                      <div className="text-gray-400 line-through text-lg mb-1">
                        ${pkg.original_price}
                      </div>
                    )}
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-[#1E3A8A]">
                        ${pkg.price}
                      </span>
                      <span className="text-gray-600">/{pkg.billing_period}</span>
                    </div>
                    {pkg.original_price && (
                      <div className="inline-block mt-3 bg-cyan-100 text-cyan-700 px-4 py-1 rounded-full text-sm font-semibold">
                        Save {Math.round(((pkg.original_price - pkg.price) / pkg.original_price) * 100)}%
                      </div>
                    )}
                  </>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {pkg.package_features.map(feature => (
                  <li key={feature.id} className="flex items-start gap-3">
                    {feature.is_included ? (
                      <Check className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.is_included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.feature_name}
                      {feature.custom_value && (
                        <span className="font-semibold text-cyan-600 ml-1">
                          ({feature.custom_value})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                  pkg.is_popular
                    ? 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg hover:shadow-xl' 
                    : 'border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white'
                }`}
              >
                {pkg.cta_text || 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1E3A8A] mb-4">
              Detailed Feature Comparison
            </h2>
            <p className="text-xl text-gray-600">
              See exactly what's included in each plan
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] text-white">
                  <th className="px-6 py-5 text-left text-lg font-semibold">Features</th>
                  {packages.map(pkg => (
                    <th key={pkg.id} className="px-6 py-5 text-center">
                      <div className="text-lg font-bold">{pkg.name}</div>
                      <div className="text-sm font-normal text-gray-200 mt-1">
                        {pkg.is_enterprise ? 'Custom' : `$${pkg.price}/${pkg.billing_period}`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((feature, idx) => (
                  <tr key={feature.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-5">
                      <div className="font-semibold text-[#1E3A8A]">{feature.name}</div>
                      {feature.description && (
                        <div className="text-sm text-gray-600 mt-1">{feature.description}</div>
                      )}
                    </td>
                    {packages.map(pkg => {
                      const pkgFeature = getFeatureForPackage(pkg, feature.name);
                      return (
                        <td key={pkg.id} className="px-6 py-5 text-center">
                          {pkgFeature ? (
                            pkgFeature.is_included ? (
                              pkgFeature.custom_value ? (
                                <span className="font-semibold text-cyan-600">
                                  {pkgFeature.custom_value}
                                </span>
                              ) : (
                                <Check className="w-6 h-6 text-cyan-500 mx-auto" />
                              )
                            ) : (
                              <X className="w-6 h-6 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1E3A8A] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <details className="bg-white p-6 rounded-xl shadow-lg group">
              <summary className="font-semibold text-[#1E3A8A] cursor-pointer text-lg flex items-center justify-between">
                Can I change plans later?
                <span className="text-cyan-500">+</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.
              </p>
            </details>
            <details className="bg-white p-6 rounded-xl shadow-lg">
              <summary className="font-semibold text-[#1E3A8A] cursor-pointer text-lg flex items-center justify-between">
                What payment methods do you accept?
                <span className="text-cyan-500">+</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and M-Pesa for Kenyan customers.
              </p>
            </details>
            <details className="bg-white p-6 rounded-xl shadow-lg">
              <summary className="font-semibold text-[#1E3A8A] cursor-pointer text-lg flex items-center justify-between">
                Is there a free trial?
                <span className="text-cyan-500">+</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Yes! All plans come with a 14-day free trial. No credit card required. Cancel anytime during the trial at no charge.
              </p>
            </details>
            <details className="bg-white p-6 rounded-xl shadow-lg">
              <summary className="font-semibold text-[#1E3A8A] cursor-pointer text-lg flex items-center justify-between">
                What happens when I exceed my impression limit?
                <span className="text-cyan-500">+</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We'll notify you when you reach 80% of your limit. You can upgrade your plan anytime to continue without interruption.
              </p>
            </details>
          </div>
          <div className="text-center mt-12">
            <a href="/faq" className="text-cyan-500 font-semibold hover:text-cyan-600 flex items-center justify-center gap-2">
              View All FAQs
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section - Navy Background */}
      <section className="bg-[#1E3A8A] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the right plan for your business
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-cyan-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-cyan-600 transition-all shadow-lg flex items-center gap-2">
              Contact Sales
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#1E3A8A] transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Navy Background */}
      <footer className="bg-[#0F1F47] text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Product</h4>
              <ul className="space-y-2">
                <li><a href="/pricing" className="text-cyan-400 font-semibold">Pricing</a></li>
                <li><a href="/features" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="/case-studies" className="hover:text-cyan-400 transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Support</h4>
              <ul className="space-y-2">
                <li><a href="/faq" className="hover:text-cyan-400 transition-colors">FAQ</a></li>
                <li><a href="/contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                <li><a href="/help" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-cyan-400 transition-colors">Blog</a></li>
                <li><a href="/careers" className="hover:text-cyan-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-cyan-400 transition-colors">Terms</a></li>
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

export default PricingPage;
