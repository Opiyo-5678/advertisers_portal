import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adsAPI } from '../api/services';
import Toast from '../components/Toast';
import { 
  Plus, Search, Filter, Eye, Edit, Trash2, 
  TrendingUp, MousePointerClick, BarChart3, AlertCircle, Send, XCircle,
  Link as LinkIcon, FileText, MessageCircle, Image as ImageIcon
} from 'lucide-react';

const MyAds = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch ads and statistics
  useEffect(() => {
    fetchAds();
    fetchStatistics();
  }, [statusFilter]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await adsAPI.getAll(params);
      setAds(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load ads. Please try again.');
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await adsAPI.getMyStatistics();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;
    
    try {
      await adsAPI.delete(id);
      setAds(ads.filter(ad => ad.id !== id));
      fetchStatistics();
      showToastMessage('Ad deleted successfully', 'success');
    } catch (err) {
      showToastMessage('Failed to delete ad', 'error');
      console.error('Error deleting ad:', err);
    }
  };

  const handleSubmitForReview = async (id) => {
    if (!window.confirm('Submit this ad for review?')) return;
    
    try {
      await adsAPI.update(id, { status: 'pending_review' });
      setAds(ads.map(ad => 
        ad.id === id ? { ...ad, status: 'pending_review' } : ad
      ));
      fetchStatistics();
      showToastMessage('🎉 Ad submitted for review!', 'success');
    } catch (err) {
      showToastMessage('Failed to submit ad', 'error');
      console.error('Error submitting ad:', err);
    }
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      pending_review: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      live: { color: 'bg-cyan-100 text-cyan-800', label: 'Live' },
      expired: { color: 'bg-gray-100 text-gray-800', label: 'Expired' },
      paused: { color: 'bg-orange-100 text-orange-800', label: 'Paused' },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredAds = ads.filter(ad =>
    ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ad.short_description && ad.short_description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-navy-800">My Ads</h1>
              <p className="text-gray-600 mt-1">Manage your advertising campaigns</p>
            </div>
            <Link
              to="/ads/create"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Create New Ad</span>
            </Link>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm">Total Ads</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.total_ads}</h3>
                  </div>
                  <BarChart3 size={40} className="text-cyan-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active Ads</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.active_ads}</h3>
                  </div>
                  <TrendingUp size={40} className="text-green-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Impressions</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.total_impressions.toLocaleString()}</h3>
                  </div>
                  <Eye size={40} className="text-purple-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Total Clicks</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.total_clicks.toLocaleString()}</h3>
                  </div>
                  <MousePointerClick size={40} className="text-orange-200" />
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search ads by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="live">Live</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Ads Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-16">
              <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No ads found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first ad to get started'}
              </p>
              <Link to="/ads/create" className="btn-primary inline-flex items-center space-x-2">
                <Plus size={20} />
                <span>Create Your First Ad</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map(ad => (
                <div key={ad.id} className="card-hover">
                  {/* Ad Image - Show first uploaded image or placeholder */}
                  <div className="h-48 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    {ad.files && ad.files.length > 0 && ad.files[0].file_path ? (
                      <img 
                        src={`http://127.0.0.1:8000${ad.files[0].file_path}`}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${ad.files && ad.files.length > 0 ? 'hidden' : ''}`}>
                      <BarChart3 size={48} className="text-cyan-400" />
                    </div>
                    {/* File count badge */}
                    {ad.files && ad.files.length > 0 && (
                      <div className="absolute top-2 right-2 bg-navy-800 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <ImageIcon size={12} />
                        <span>{ad.files.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Ad Content */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg text-navy-800 line-clamp-2 flex-1">
                        {ad.title}
                      </h3>
                      {getStatusBadge(ad.status)}
                    </div>

                    {ad.short_description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {ad.short_description}
                      </p>
                    )}

                    {/* Links Section */}
{(ad.website_url || ad.catalog_url || ad.whatsapp_link) && (
  <div className="pt-2 border-t">
    <p className="text-xs font-semibold text-gray-700 mb-2">Links:</p>
    <div className="flex flex-wrap gap-2">
      {ad.website_url && (
        <a
          href={ad.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors flex items-center space-x-1"
        >
          <LinkIcon size={12} />
          <span>Website</span>
        </a>
      )}
      {ad.catalog_url && (
        <a
          href={ad.catalog_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded hover:bg-purple-100 transition-colors flex items-center space-x-1"
        >
          <FileText size={12} />
          <span>Catalog</span>
        </a>
      )}
      {ad.whatsapp_link && (
        <a
          href={ad.whatsapp_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 transition-colors flex items-center space-x-1"
        >
          <MessageCircle size={12} />
          <span>WhatsApp</span>
        </a>
      )}
    </div>
  </div>
)}

                    {/* Rejection Reason */}
                    {ad.status === 'rejected' && ad.rejection_reason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-red-800 mb-1 flex items-center">
                          <XCircle size={14} className="mr-1" />
                          Rejection Reason:
                        </p>
                        <p className="text-xs text-red-700">{ad.rejection_reason}</p>
                      </div>
                    )}

                    {/* Analytics */}
                    <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye size={16} />
                          <span>{ad.total_impressions || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MousePointerClick size={16} />
                          <span>{ad.total_clicks || 0}</span>
                        </div>
                      </div>
                      <span className="font-medium text-cyan-600">
                        {ad.total_impressions > 0 
                          ? `${((ad.total_clicks / ad.total_impressions) * 100).toFixed(1)}% CTR`
                          : '0% CTR'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-3">
                      {/* Submit for Review Button */}
                      {(ad.status === 'draft' || ad.status === 'rejected') && (
                        <button
                          onClick={() => handleSubmitForReview(ad.id)}
                          className="w-full btn-primary text-sm py-2 flex items-center justify-center space-x-1"
                        >
                          <Send size={16} />
                          <span>{ad.status === 'rejected' ? 'Resubmit for Review' : 'Submit for Review'}</span>
                        </button>
                      )}

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/ads/${ad.id}`)}
                          className="flex-1 btn-outline text-sm py-2 flex items-center justify-center space-x-1"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => navigate(`/ads/${ad.id}/edit`)}
                          className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Date Info */}
                  {(ad.start_date || ad.end_date) && (
                    <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                      {ad.start_date && ad.end_date ? (
                        <span>📅 {new Date(ad.start_date).toLocaleDateString()} - {new Date(ad.end_date).toLocaleDateString()}</span>
                      ) : ad.start_date ? (
                        <span>📅 Starts: {new Date(ad.start_date).toLocaleDateString()}</span>
                      ) : (
                        <span>📅 Ends: {new Date(ad.end_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyAds;