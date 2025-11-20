import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Toast from '../components/Toast';
import { Calendar, MapPin, Film, Theater, Music, AlertCircle, Send } from 'lucide-react';

const SubmitEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [venues, setVenues] = useState([]);
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    venue_name: '',
    city: '',
    event_date: '',
    event_time: '',
    end_date: '',
    description: '',
    ticket_link: '',
    image: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    fetchVenues();
  }, [user, navigate]);

  const fetchVenues = async () => {
    try {
      const response = await axios.get('/api/advertisers/venues/');
      setVenues(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.venue_name.trim()) newErrors.venue_name = 'Venue is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.event_date) newErrors.event_date = 'Event date is required';

    // Check if event date is in the future
    if (formData.event_date) {
      const eventDate = new Date(formData.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        newErrors.event_date = 'Event date must be in the future';
      }
    }

    // Validate ticket link if provided
    if (formData.ticket_link && !isValidUrl(formData.ticket_link)) {
      newErrors.ticket_link = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToastMessage('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      await axios.post('/api/advertisers/events/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showToastMessage('Event submitted successfully! It will be reviewed by our team.', 'success');
      
      setTimeout(() => {
        navigate('/events');
      }, 2000);

    } catch (error) {
      console.error('Error submitting event:', error);
      showToastMessage(
        error.response?.data?.message || 'Failed to submit event. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const categoryIcons = {
    film: <Film size={20} />,
    theater: <Theater size={20} />,
    concert: <Music size={20} />,
  };

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
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Submit Event</h1>
            <p className="text-gray-600 mt-2">
              Share your upcoming film, theater show, or concert
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Submission Guidelines:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All submissions require admin approval</li>
                  <li>Events must be for public entertainment only</li>
                  <li>Provide accurate dates and venue information</li>
                  <li>Commercial advertisements are not allowed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Event Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['film', 'theater', 'concert'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.category === cat
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {categoryIcons[cat]}
                      <span className="text-sm font-medium capitalize">{cat}</span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Avatar: The Way of Water"
                maxLength={200}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Venue Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="venue_name"
                value={formData.venue_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.venue_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Sarit Centre Cinema"
                list="venues-list"
              />
              <datalist id="venues-list">
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.name} />
                ))}
              </datalist>
              {errors.venue_name && (
                <p className="text-sm text-red-500 mt-1">{errors.venue_name}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Nairobi"
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">{errors.city}</p>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.event_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.event_date && (
                  <p className="text-sm text-red-500 mt-1">{errors.event_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Event Time (Optional)
                </label>
                <input
                  type="time"
                  name="event_time"
                  value={formData.event_time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* End Date (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                End Date (Optional - for multi-day events)
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Brief description of the event..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Ticket Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Ticket Link (Optional)
              </label>
              <input
                type="url"
                name="ticket_link"
                value={formData.ticket_link}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.ticket_link ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://tickets.example.com"
              />
              {errors.ticket_link && (
                <p className="text-sm text-red-500 mt-1">{errors.ticket_link}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Event Image (Optional)
              </label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Poster or promotional image (max 3MB)
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Submit Event</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SubmitEvent;