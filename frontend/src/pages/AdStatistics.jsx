import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdStatistics = () => {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, [adId]);

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/advertisers/ads/${adId}/statistics/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load statistics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold">{stats.ad_title}</h1>
        <p className="text-gray-600">{stats.ad_category}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Clicks</p>
          <p className="text-3xl font-bold mt-2">{stats.total_clicks}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">This Week</p>
          <p className="text-3xl font-bold mt-2">{stats.clicks_this_week}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Today</p>
          <p className="text-3xl font-bold mt-2">{stats.clicks_today}</p>
        </div>
      </div>

      {/* Daily Clicks Chart */}
      {stats.daily_data && stats.daily_data.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Clicks (Last 30 Days)</h2>
          <div className="h-64">
            <SimpleLineChart data={stats.daily_data} />
          </div>
        </div>
      )}

      {/* Device Breakdown */}
      {stats.device_breakdown && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Device Breakdown</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Mobile</span>
              <span className="font-semibold">{stats.device_breakdown.mobile}%</span>
            </div>
            <div className="flex justify-between">
              <span>Desktop</span>
              <span className="font-semibold">{stats.device_breakdown.desktop}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Ad Details */}
      <div className="bg-gray-50 p-6 rounded-lg mt-8">
        <h3 className="font-semibold mb-2">Ad Period</h3>
        <p className="text-gray-600">
          {stats.start_date} to {stats.end_date || 'Ongoing'}
        </p>
      </div>
    </div>
  );
};

// Simple Line Chart Component
const SimpleLineChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.clicks));
  const chartHeight = 200;

  return (
    <div className="relative w-full h-full">
      <svg width="100%" height={chartHeight} className="overflow-visible">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="0"
            y1={i * (chartHeight / 4)}
            x2="100%"
            y2={i * (chartHeight / 4)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Line chart */}
        <polyline
          points={data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = chartHeight - (d.clicks / maxValue) * chartHeight;
            return `${x}%,${y}`;
          }).join(' ')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = chartHeight - (d.clicks / maxValue) * chartHeight;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={y}
              r="3"
              fill="#3b82f6"
            />
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        {data.filter((_, i) => i % 5 === 0).map((d, i) => (
          <span key={i}>{new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        ))}
      </div>
    </div>
  );
};

export default AdStatistics;