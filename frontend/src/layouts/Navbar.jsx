import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-cyan-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-xl text-cyan-600">
              A
            </div>
            <span className="text-xl font-bold text-white">AdPortal</span>
          </Link>

           <Link 
    to="/" 
    className="text-white px-3 py-1 rounded-md hover:bg-cyan-600 transition-all border border-white/30"
  >
    Home
  </Link>
</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/dashboard" className="text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition-all">
              Dashboard
            </Link>
            <Link to="/dashboard/ads" className="text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition-all">
              My Ads
            </Link>
            <Link to="/dashboard/calendar" className="text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition-all">
              Calendar
            </Link>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Notifications */}
            <button className="relative p-2 rounded-lg transition-all text-white hover:bg-cyan-600">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg transition-all text-white hover:bg-cyan-600"
              >
                <User size={20} />
                <span className="text-sm">{user?.username}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-navy-800 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-cyan-600 rounded-lg text-white"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden pb-4">
            {/* Add this FIRST in mobile menu */}
<Link
  to="/"
  className="block py-2 px-4 text-white hover:bg-cyan-600 rounded-lg transition-all font-semibold border-b border-cyan-400"
  onClick={() => setShowMobileMenu(false)}
>
   Home
</Link>
            <Link
              to="/dashboard"
              className="block py-2 px-4 text-white hover:bg-cyan-600 rounded-lg transition-all"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard/ads"
              className="block py-2 px-4 text-white hover:bg-cyan-600 rounded-lg transition-all"
              onClick={() => setShowMobileMenu(false)}
            >
              My Ads
            </Link>
            <Link
              to="/dashboard/calendar"
              className="block py-2 px-4 text-white hover:bg-cyan-600 rounded-lg transition-all"
              onClick={() => setShowMobileMenu(false)}
            >
              Calendar
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 px-4 text-white hover:bg-cyan-600 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;