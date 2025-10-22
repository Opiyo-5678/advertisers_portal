import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../api/services';
import Toast from '../components/Toast';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  DollarSign, 
  Clock,
  X,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pause,
  Filter,
  Search
} from 'lucide-react';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchBookings();
    fetchStatistics();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await bookingsAPI.getAll(params);
      setBookings(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToastMessage('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await bookingsAPI.getMyStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      await bookingsAPI.cancel(id, reason);
      showToastMessage('Booking cancelled successfully', 'success');
      fetchBookings();
      fetchStatistics();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showToastMessage('Failed to cancel booking', 'error');
    }
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock, 
        label: 'Pending' 
      },
      confirmed: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: CheckCircle, 
        label: 'Confirmed' 
      },
      active: { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle, 
        label: 'Active' 
      },
      completed: { 
        color: 'bg-gray-100 text-gray-800', 
        icon: CheckCircle, 
        label: 'Completed' 
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800', 
        icon: XCircle, 
        label: 'Cancelled' 
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${config.color}`}>
        <Icon size={14} />
        <span>{config.label}</span>
      </span>
    );
  };

  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isBookingActive = (booking) => {
    const today = new Date().toISOString().split('T')[0];
    return booking.status === 'active' && 
           today >= booking.start_date && 
           today <= booking.end_date;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.ad?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.placement?.placement_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

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
              <h1 className="text-3xl font-bold text-navy-800">My Bookings</h1>
              <p className="text-gray-600 mt-1">View and manage your advertising bookings</p>
            </div>
            <Link
              to="/calendar"
              className="btn-primary flex items-center space-x-2"
            >
              <CalendarIcon size={20} />
              <span>New Booking</span>
            </Link>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm">Total Bookings</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.total_bookings}</h3>
                  </div>
                  <CalendarIcon size={40} className="text-cyan-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.active_bookings}</h3>
                  </div>
                  <CheckCircle size={40} className="text-green-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Completed</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.completed_bookings}</h3>
                  </div>
                  <CheckCircle size={40} className="text-purple-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Total Spent</p>
                    <h3 className="text-3xl font-bold mt-1">${parseFloat(stats.total_revenue).toFixed(2)}</h3>
                  </div>
                  <DollarSign size={40} className="text-orange-200" />
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by ad or placement..."
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
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <CalendarIcon size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first booking to get started'}
              </p>
              <Link to="/calendar" className="btn-primary inline-flex items-center space-x-2">
                <CalendarIcon size={20} />
                <span>Create Booking</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="card-hover">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left: Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-navy-800">
                            {booking.ad?.title || 'Ad Title'}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {booking.placement?.placement_name || 'Placement'}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>

                      {/* Dates */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon size={16} />
                          <span>
                            {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span>{booking.total_days} days</span>
                        </div>
                      </div>

                      {/* Active indicator with days remaining */}
                      {isBookingActive(booking) && (
                        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800 font-medium">
                            🟢 Currently Running • {calculateDaysRemaining(booking.end_date)} days remaining
                          </p>
                        </div>
                      )}

                      {/* Cancellation reason */}
                      {booking.status === 'cancelled' && booking.cancellation_reason && (
                        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-red-800 mb-1">Cancellation Reason:</p>
                          <p className="text-xs text-red-700">{booking.cancellation_reason}</p>
                        </div>
                      )}
                    </div>

                    {/* Right: Price & Actions */}
                    <div className="flex flex-col items-end space-y-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Price</p>
                        <p className="text-2xl font-bold text-cyan-600">
                          ${parseFloat(booking.final_price).toFixed(2)}
                        </p>
                        {booking.discount_percentage > 0 && (
                          <p className="text-xs text-green-600">
                            {booking.discount_percentage}% discount applied
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/bookings/${booking.id}`)}
                          className="btn-outline text-sm py-2 px-3 flex items-center space-x-1"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Booking"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBookings;