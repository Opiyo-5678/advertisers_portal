import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Film, Music, Theater, ExternalLink, Home } from 'lucide-react';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' 
        ? '/api/advertisers/events/upcoming/'
        : `/api/advertisers/events/?category=${filter}&status=published`;
      
      const response = await axios.get(url);
      setEvents(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    film: <Film className="text-purple-600" size={24} />,
    theater: <Theater className="text-red-600" size={24} />,
    concert: <Music className="text-blue-600" size={24} />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Event Calendar</h1>
              <p className="text-lg">Upcoming films, theater plays, and concerts</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Home size={20} />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter & Submit Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter('film')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'film' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Film size={18} className="inline mr-1" />
              Films
            </button>
            <button
              onClick={() => setFilter('theater')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'theater' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Theater size={18} className="inline mr-1" />
              Theater
            </button>
            <button
              onClick={() => setFilter('concert')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'concert' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Music size={18} className="inline mr-1" />
              Concerts
            </button>
          </div>

          <button
            onClick={() => navigate('/events/submit')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Event
          </button>
        </div>

        {/* Event Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No upcoming events</p>
            <p className="text-gray-500 mt-2">Be the first to submit an event!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                {event.image && (
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {categoryIcons[event.category]}
                    <span className="text-sm font-semibold text-gray-600 uppercase">
                      {event.category_display}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  
                  {event.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="flex-shrink-0" />
                      <span>{event.venue_name}, {event.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="flex-shrink-0" />
                      <span>{new Date(event.event_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    {event.event_time && (
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="flex-shrink-0" />
                        <span>{event.event_time}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;