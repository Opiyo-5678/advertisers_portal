/*
 * ============================================================================
 * Dashboard.jsx - FINAL ULTRA-CLEAN VERSION
 * ============================================================================
 * 
 * FOCUS: Only 6 core requirements
 * REMOVED: All analytics and Active Bookings
 * KEPT: Welcome message, Info text, Quick Actions only
 * 
 * DATE CLEANED: October 27, 2025
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { 
  Calendar, 
  Plus,
  Info
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // State declarations
  const [showWelcome, setShowWelcome] = useState(false);

  // Show welcome message for new users
  useEffect(() => {
    if (location.state?.newUser) {
      setShowWelcome(true);
    }
  }, [location]);

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

        {/* Brief Info Text */}
        <div className="card bg-cyan-50 border-l-4 border-cyan-500">
          <div className="flex items-start space-x-3">
            <Info className="text-cyan-600 flex-shrink-0" size={20} />
            <p className="text-navy-800">
              Upload logos, write ad text, and link to your website or catalog. All files are security-scanned.
            </p>
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
      </div>
    </>
  );
};

export default Dashboard;