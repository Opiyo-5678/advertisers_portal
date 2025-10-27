/*
 * ============================================================================
 * FAQPage.jsx - COMMENTED OUT
 * ============================================================================
 * 
 * REASON: Removing "traditional advertising" marketing content
 * 
 * This file contained marketing fluff including:
 * - FAQ system with backend API integration
 * - Search and category filtering
 * - "Was this helpful" feedback system
 * - Contact support CTA section
 * - Popular resources marketing section
 * - Full navigation and footer
 * 
 * DATE COMMENTED: October 27, 2025
 * 
 * NOTE: Keeping this file for reference. To restore, uncomment the code below
 * ============================================================================
 */

/* 
import React, { useState, useEffect } from 'react';
import { Search, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, MessageCircle, Mail, Phone } from 'lucide-react';

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/marketing/faqs/by_category/')
      .then(res => res.json())
      .then(data => {
        setFaqs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  const handleHelpful = async (faqId, isHelpful) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/advertisers/marketing/faqs/${faqId}/mark_helpful/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful: isHelpful })
      });
      alert('Thank you for your feedback!');
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => {
      const matchesSearch = searchTerm === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || category.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
  })).filter(category => category.faqs.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-xl text-gray-600">Loading FAQs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Navy Blue Header *\/}
      <nav className="bg-[#1E3A8A] shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-white">AdPortal</h1>
              <div className="hidden md:flex gap-6">
                <a href="/" className="text-white hover:text-cyan-300 transition-colors">Home</a>
                <a href="/pricing" className="text-white hover:text-cyan-300 transition-colors">Pricing</a>
                <a href="/faq" className="text-cyan-300 font-semibold">FAQ</a>
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

      {/* Header - Navy Background *\/}
      <section className="bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6">
            How Can We Help You?
          </h1>
          <p className="text-xl text-center text-gray-200 mb-12 max-w-2xl mx-auto">
            Find answers to common questions about our advertising platform
          </p>

          {/* Search Bar *\/}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter *\/}
      <section className="container mx-auto px-4 py-8 -mt-6 relative z-10">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-semibold transition-all shadow-md ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'bg-white text-[#1E3A8A] hover:bg-gray-50'
            }`}
          >
            All Topics
          </button>
          {faqs.map(category => (
            <button
              key={category.category}
              onClick={() => setSelectedCategory(category.category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all shadow-md ${
                selectedCategory === category.category
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-white text-[#1E3A8A] hover:bg-gray-50'
              }`}
            >
              {category.category_display}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Content *\/}
      <section className="container mx-auto px-4 pb-20">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">
              No FAQs found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-cyan-500 font-semibold hover:text-cyan-600"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12">
            {filteredFaqs.map(category => (
              <div key={category.category}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-2 h-12 bg-cyan-500 rounded-full"></div>
                  <h2 className="text-3xl font-bold text-[#1E3A8A]">
                    {category.category_display}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.faqs.map(faq => (
                    <div
                      key={faq.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-[#1E3A8A] text-lg pr-4">
                          {faq.question}
                        </span>
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="w-6 h-6 text-cyan-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                        )}
                      </button>

                      {expandedFaq === faq.id && (
                        <div className="px-8 pb-8">
                          <div
                            className="text-gray-700 prose prose-lg max-w-none mb-6 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />

                          {/* Helpful Buttons *\/}
                          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                            <span className="text-sm text-gray-600 font-medium">Was this helpful?</span>
                            <button
                              onClick={() => handleHelpful(faq.id, true)}
                              className="flex items-center gap-2 px-5 py-2 rounded-lg border-2 border-gray-300 hover:bg-cyan-50 hover:border-cyan-500 transition-all"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm font-medium">Yes</span>
                            </button>
                            <button
                              onClick={() => handleHelpful(faq.id, false)}
                              className="flex items-center gap-2 px-5 py-2 rounded-lg border-2 border-gray-300 hover:bg-red-50 hover:border-red-500 transition-all"
                            >
                              <ThumbsDown className="w-4 h-4" />
                              <span className="text-sm font-medium">No</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Support CTA - Navy Background *\/}
      <section className="bg-[#1E3A8A] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Our support team is ready to assist you with any questions
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-center hover:bg-white/20 transition-all">
              <MessageCircle className="w-12 h-12 text-cyan-300 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Live Chat</h3>
              <p className="text-gray-200 mb-4">Available 24/7</p>
              <button className="text-cyan-300 font-semibold hover:text-cyan-200">
                Start Chat →
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-center hover:bg-white/20 transition-all">
              <Mail className="w-12 h-12 text-cyan-300 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Email Us</h3>
              <p className="text-gray-200 mb-4">Response in 24hrs</p>
              <button className="text-cyan-300 font-semibold hover:text-cyan-200">
                Send Email →
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-center hover:bg-white/20 transition-all">
              <Phone className="w-12 h-12 text-cyan-300 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Call Us</h3>
              <p className="text-gray-200 mb-4">Mon-Fri 9AM-6PM</p>
              <button className="text-cyan-300 font-semibold hover:text-cyan-200">
                +254 123 456 789
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Resources *\/}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-12">
            Popular Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <a href="/getting-started" className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100">
              <h3 className="font-semibold text-xl text-[#1E3A8A] mb-3">Getting Started Guide</h3>
              <p className="text-gray-600 mb-4">
                Learn how to create your first ad campaign in minutes
              </p>
              <span className="text-cyan-500 font-semibold hover:text-cyan-600">
                Read More →
              </span>
            </a>
            <a href="/pricing" className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100">
              <h3 className="font-semibold text-xl text-[#1E3A8A] mb-3">Pricing Plans</h3>
              <p className="text-gray-600 mb-4">
                Compare our plans and find the perfect fit for your business
              </p>
              <span className="text-cyan-500 font-semibold hover:text-cyan-600">
                View Pricing →
              </span>
            </a>
            <a href="/case-studies" className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100">
              <h3 className="font-semibold text-xl text-[#1E3A8A] mb-3">Success Stories</h3>
              <p className="text-gray-600 mb-4">
                See how businesses achieved remarkable results
              </p>
              <span className="text-cyan-500 font-semibold hover:text-cyan-600">
                Read Stories →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer - Navy Background *\/}
      <footer className="bg-[#0F1F47] text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Product</h4>
              <ul className="space-y-2">
                <li><a href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="/features" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="/case-studies" className="hover:text-cyan-400 transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg">Support</h4>
              <ul className="space-y-2">
                <li><a href="/faq" className="text-cyan-400 font-semibold">FAQ</a></li>
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

export default FAQPage;
*/

// Placeholder export to prevent errors if this file is still imported somewhere
const FAQPage = () => null;
export default FAQPage;