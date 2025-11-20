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
import DemoLogin from './pages/DemoLogin';

// Private Dashboard Pages (Login Required)
import Dashboard from './pages/Dashboard';
import CreateAd from './pages/CreateAd';
import MyAds from './pages/MyAds';
import MyBookings from './pages/MyBookings';
import Calendar from './pages/Calendar';

// Event pages - commented out (separate project)
// import Events from './pages/Events';
// import SubmitEvent from './pages/SubmitEvent';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ========================================= */}
          {/*  PUBLIC ROUTES (No Authentication)      */}
          {/* ========================================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo-login" element={<DemoLogin />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Events - DISABLED (separate project per John's request) */}
          {/* <Route path="/events" element={<Events />} /> */}
          {/* <Route path="/events/submit" element={<SubmitEvent />} /> */}
          
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
            <Route index element={<Dashboard />} />
            <Route path="ads" element={<MyAds />} />
            <Route path="ads/create" element={<CreateAd />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="calendar" element={<Calendar />} />
          </Route>

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;