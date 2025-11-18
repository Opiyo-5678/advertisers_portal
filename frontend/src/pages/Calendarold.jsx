import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI, adsAPI, placementsAPI } from '../api/services';
import Toast from '../components/Toast';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  DollarSign, 
  AlertCircle,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [myAds, setMyAds] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Booking form state
  const [selectedAd, setSelectedAd] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  useEffect(() => {
    calculatePrice();
    if (selectedPlacement && startDate && endDate) {
      checkAvailability();
    }
  }, [startDate, endDate, selectedPlacement]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's ads
      const adsResponse = await adsAPI.getAll({ status: 'approved' });
      setMyAds(adsResponse.data.results || adsResponse.data);

      // Fetch placements
      const placementsResponse = await placementsAPI.getAll();
      setPlacements(placementsResponse.data.results || placementsResponse.data);

      // Fetch bookings for calendar view
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const bookingsResponse = await bookingsAPI.getCalendar({
        start_date: startOfMonth.toISOString().split('T')[0],
        end_date: endOfMonth.toISOString().split('T')[0]
      });
      setBookings(bookingsResponse.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      showToastMessage('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!selectedPlacement || !startDate || !endDate) return;

    setIsCheckingAvailability(true);
    try {
      const response = await placementsAPI.checkAvailability(
        selectedPlacement,
        startDate,
        endDate
      );

      if (response.data.is_available) {
        setAvailabilityMessage('✓ Dates are available!');
      } else {
        setAvailabilityMessage('⚠ These dates are already booked. Please choose different dates.');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityMessage('');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const calculatePrice = () => {
    if (!startDate || !endDate || !selectedPlacement) {
      setTotalPrice(0);
      setTotalDays(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const placement = placements.find(p => p.id === parseInt(selectedPlacement));
    if (placement) {
      const price = days * parseFloat(placement.base_price_per_day);
      setTotalDays(days);
      setTotalPrice(price);
    }
  };

  const handleBooking = async () => {
    if (!selectedAd || !selectedPlacement || !startDate || !endDate) {
      showToastMessage('Please fill in all fields', 'error');
      return;
    }

    if (availabilityMessage.includes('⚠')) {
      showToastMessage('Please choose available dates', 'error');
      return;
    }

    try {
      const bookingData = {
        ad_id: parseInt(selectedAd),
        placement_id: parseInt(selectedPlacement),
        start_date: startDate,
        end_date: endDate
      };

      await bookingsAPI.create(bookingData);
      
      showToastMessage('🎉 Booking created successfully!', 'success');
      
      // Reset form
      setSelectedAd('');
      setSelectedPlacement('');
      setStartDate('');
      setEndDate('');
      setAvailabilityMessage('');
      
      // Refresh data
      fetchData();

      setTimeout(() => {
        navigate('/bookings');
      }, 2000);

    } catch (error) {
      console.error('Error creating booking:', error);
      showToastMessage(
        error.response?.data?.message || 'Failed to create booking',
        'error'
      );
    }
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => {
      return dateStr >= booking.start_date && dateStr <= booking.end_date;
    });
  };

  const isDateBooked = (date) => {
    return getBookingsForDate(date).length > 0;
  };

  const isDateInRange = (date) => {
    if (!startDate || !endDate) return false;
    const dateStr = date.toISOString().split('T')[0];
    return dateStr >= startDate && dateStr <= endDate;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const bookingsOnDate = getBookingsForDate(date);
      const isBooked = bookingsOnDate.length > 0;
      const isSelected = isDateInRange(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 min-h-[80px] border border-gray-200 rounded-lg relative ${
            isToday ? 'bg-cyan-50 border-cyan-300' : 'bg-white'
          } ${isBooked ? 'bg-red-50' : ''} ${isSelected ? 'bg-green-100 border-green-400' : ''}`}
        >
          <div className={`text-sm font-semibold ${isToday ? 'text-cyan-700' : 'text-gray-700'}`}>
            {day}
          </div>
          
          {/* Show bookings on this date */}
          {bookingsOnDate.length > 0 && (
            <div className="mt-1 space-y-1">
              {bookingsOnDate.slice(0, 2).map((booking, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded truncate"
                  title={`${booking.ad_title} - ${booking.placement_name}`}
                >
                  {booking.placement_name}
                </div>
              ))}
              {bookingsOnDate.length > 2 && (
                <div className="text-xs text-gray-600">
                  +{bookingsOnDate.length - 2} more
                </div>
              )}
            </div>
          )}

          {isSelected && (
            <div className="absolute top-1 right-1">
              <Check size={14} className="text-green-600" />
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h3 className="text-xl font-bold text-navy-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-cyan-50 border-2 border-cyan-300 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-50 border border-gray-200 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded"></div>
            <span>Your Selection</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CalendarIcon size={48} className="mx-auto text-gray-400 animate-pulse mb-4" />
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-800">Calendar & Bookings</h1>
            <p className="text-gray-600 mt-1">Book advertising slots and view your campaign periods</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Side: Calendar */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center space-x-2 mb-6">
                  <CalendarIcon className="text-cyan-600" size={24} />
                  <h2 className="text-xl font-bold text-navy-800">Advertising Calendar</h2>
                </div>
                {renderCalendar()}
              </div>

              {/* Current Bookings Display */}
              <div className="card mt-6">
                <h3 className="text-lg font-bold text-navy-800 mb-4 flex items-center">
                  <Clock className="mr-2 text-purple-600" size={20} />
                  Active Advertising Periods
                </h3>
                
                {bookings.filter(b => b.status === 'active').length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No active campaigns this month</p>
                ) : (
                  <div className="space-y-3">
                    {bookings
                      .filter(b => b.status === 'active')
                      .map((booking, idx) => (
                        <div key={idx} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-navy-800">{booking.ad_title}</h4>
                              <p className="text-sm text-gray-600">{booking.placement_name}</p>
                            </div>
                            <span className="badge bg-purple-100 text-purple-800">Active</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            📅 {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Booking Form */}
            <div className="lg:col-span-1">
              <div className="card sticky top-8">
                <h2 className="text-xl font-bold text-navy-800 mb-6">Book New Slot</h2>

                <div className="space-y-4">
                  
                  {/* Select Ad */}
                  <div>
                    <label className="block text-sm font-semibold text-navy-800 mb-2">
                      Select Your Ad <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedAd}
                      onChange={(e) => setSelectedAd(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Choose an ad...</option>
                      {myAds.map(ad => (
                        <option key={ad.id} value={ad.id}>
                          {ad.title}
                        </option>
                      ))}
                    </select>
                    {myAds.length === 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        No approved ads available. <a href="/ads/create" className="underline">Create one</a>
                      </p>
                    )}
                  </div>

                  {/* Select Placement */}
                  <div>
                    <label className="block text-sm font-semibold text-navy-800 mb-2">
                      Ad Placement <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedPlacement}
                      onChange={(e) => setSelectedPlacement(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Choose placement...</option>
                      {placements.map(placement => (
                        <option key={placement.id} value={placement.id}>
                          {placement.placement_name} - ${placement.base_price_per_day}/day
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-semibold text-navy-800 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-semibold text-navy-800 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                  </div>

                  {/* Availability Message */}
                  {availabilityMessage && (
                    <div className={`p-3 rounded-lg text-sm ${
                      availabilityMessage.includes('✓') 
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}>
                      {availabilityMessage}
                    </div>
                  )}

                  {/* Price Summary */}
                  {totalPrice > 0 && (
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-700">Duration:</span>
                        <span className="font-semibold text-navy-800">{totalDays} days</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-cyan-300">
                        <span className="text-sm font-semibold text-gray-700">Total Price:</span>
                        <span className="text-xl font-bold text-cyan-600">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <button
                    onClick={handleBooking}
                    disabled={!selectedAd || !selectedPlacement || !startDate || !endDate || availabilityMessage.includes('⚠')}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <CalendarIcon size={20} />
                    <span>Confirm Booking</span>
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Your booking will be pending until payment is confirmed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;