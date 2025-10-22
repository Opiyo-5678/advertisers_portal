import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adsAPI, bookingsAPI } from '../api/services';
import Toast from '../components/Toast';
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Calendar, 
  Plus,
  BarChart3,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // All state declarations together
  const [showWelcome, setShowWelcome] = useState(false);
  const [stats, setStats] = useState({
    total_ads: 0,
    active_ads: 0,
    total_impressions: 0,
    total_clicks: 0,
    average_ctr: 0,
  });
  const [bookingStats, setBookingStats] = useState({
    active_bookings: 0,
    total_revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Show welcome message for new users
  useEffect(() => {
    if (location.state?.newUser) {
      setShowWelcome(true);
    }
  }, [location]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [adsResponse, bookingsResponse] = await Promise.all([
        adsAPI.getMyStatistics(),
        bookingsAPI.getMyStatistics(),
      ]);

      setStats(adsResponse.data);
      setBookingStats(bookingsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-grey-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-navy-800 mt-2">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={color} size={24} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <>
      {showWelcome && (
        <Toast
          message={`🎉 Welcome to AdPortal, ${user?.first_name}! Your account is ready to go!`}
          type="success"
          onClose={() => setShowWelcome(false)}
          duration={5000}
        />
      )}
      
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy-800">
              Welcome back, {user?.first_name || user?.username}! 👋
            </h1>
            <p className="text-dark-grey-600 mt-1">
              Here's what's happening with your ads today.
            </p>
          </div>
          <Link to="/dashboard/ads/create" className="btn-primary mt-4 md:mt-0 inline-flex items-center space-x-2">
            <Plus size={20} />
            <span>Create New Ad</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={BarChart3}
            title="Total Ads"
            value={stats.total_ads}
            color="text-cyan-600"
            bgColor="bg-cyan-100"
          />
          <StatCard
            icon={TrendingUp}
            title="Active Ads"
            value={stats.active_ads}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            icon={Eye}
            title="Total Impressions"
            value={stats.total_impressions.toLocaleString()}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            icon={MousePointer}
            title="Total Clicks"
            value={stats.total_clicks.toLocaleString()}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CTR Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-navy-800 mb-4">
              Click-Through Rate
            </h3>
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="text-5xl font-bold text-cyan-500">
                  {stats.average_ctr.toFixed(2)}%
                </div>
                <p className="text-dark-grey-600 mt-2">Average CTR</p>
              </div>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-navy-800 mb-4 flex items-center">
              <Calendar className="mr-2" size={20} />
              Active Bookings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-dark-grey-600">Active Campaigns</span>
                <span className="text-2xl font-bold text-navy-800">
                  {bookingStats.active_bookings}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-grey-600">Total Revenue</span>
                <span className="text-2xl font-bold text-green-600">
                  ${parseFloat(bookingStats.total_revenue).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-navy-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/dashboard/ads/create"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all group"
            >
              <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200">
                <Plus className="text-cyan-600" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-navy-800">Create Ad</h4>
                <p className="text-sm text-dark-grey-600">Start a new campaign</p>
              </div>
            </Link>

            <Link
              to="/dashboard/calendar"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all group"
            >
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-navy-800">Book Placement</h4>
                <p className="text-sm text-dark-grey-600">Schedule your ads</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Getting Started */}
        <div className="card">
          <h3 className="text-lg font-semibold text-navy-800 mb-4 flex items-center">
            <Clock className="mr-2" size={20} />
            Getting Started
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium text-navy-800">Create your first ad</h4>
                <p className="text-sm text-dark-grey-600">Design and upload your advertisement</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium text-navy-800">Choose placement & schedule</h4>
                <p className="text-sm text-dark-grey-600">Select where and when to show your ad</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium text-navy-800">Track your results</h4>
                <p className="text-sm text-dark-grey-600">Monitor clicks and impressions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;