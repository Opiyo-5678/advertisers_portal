import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages (No Login Required)
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';

// Private Dashboard Pages (Login Required)
import Dashboard from './pages/Dashboard';
import CreateAd from './pages/CreateAd';
import MyAds from './pages/MyAds';
import MyBookings from './pages/MyBookings';
import Calendar from './pages/Calendar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ========================================= */}
          {/*  PUBLIC ROUTES (No Authentication)      */}
          {/* ========================================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ========================================= */}
          {/*  PRIVATE ROUTES (Require Login)         */}
          {/* ========================================= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Nested Dashboard Routes */}
            <Route index element={<Dashboard />} />  {/* /dashboard */}
            <Route path="ads" element={<MyAds />} />  {/* /dashboard/ads */}
            <Route path="ads/create" element={<CreateAd />} />  {/* /dashboard/ads/create */}
            <Route path="bookings" element={<MyBookings />} />  {/* /dashboard/bookings */}
            <Route path="calendar" element={<Calendar />} />  {/* /dashboard/calendar */}
          </Route>

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;