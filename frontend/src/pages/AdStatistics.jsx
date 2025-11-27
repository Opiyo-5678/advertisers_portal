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
      
      // STEP 1: Get ad details from Django (to get website_url, title, category)
      const adResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/advertisers/ads/${adId}/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const adData = adResponse.data;
      
      // STEP 2: Get real statistics from DNN API using website_url
      let dnnStats = null;
      
      if (adData.website_url) {
        try {
          const statsResponse = await axios.get(
            'https://webflyers.uk/DesktopModules/DZ_SponsorsWall/ClickStatsAPI.ashx',
            {
              params: { sponsor_url: adData.website_url },
              timeout: 5000 // 5 second timeout
            }
          );
          
          if (statsResponse.data.success) {
            dnnStats = statsResponse.data;
          }
        } catch (apiError) {
          console.error('Failed to fetch DNN statistics:', apiError);
          // Continue without stats - will show zeros
        }
      }
      
      // STEP 3: Merge ad details with statistics
      const mergedStats = {
        ad_title: adData.title || adData.company_name || 'Ad Statistics',
        ad_category: adData.category || adData.merchandise_category || '',
        website_url: adData.website_url || '',
        start_date: adData.start_date || 'N/A',
        end_date: adData.end_date || 'Ongoing',
        
        // Statistics from DNN (or zeros if not available)
        total_clicks: dnnStats?.total_clicks || 0,
        clicks_today: dnnStats?.clicks_today || 0,
        clicks_this_week: dnnStats?.clicks_this_week || 0,
        clicks_this_month: dnnStats?.clicks_this_month || 0,
        daily_data: dnnStats?.daily_data || [],
        device_breakdown: dnnStats?.device_breakdown || { mobile: 0, desktop: 0 }
      };
      
      setStats(mergedStats);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching statistics:', err);
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
          onClick={() => navigate('/dashboard/ads')}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
        >
          Back to My Ads
        </button>
      </div>
    );
  }

  const totalClicks = stats?.total_clicks || 0;
  const clicksWeek = stats?.clicks_this_week || 0;
  const clicksToday = stats?.clicks_today || 0;
  const hasData = totalClicks > 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/ads')}
          className="text-blue-600 mb-4 hover:underline"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-navy-800">{stats?.ad_title || 'Ad Statistics'}</h1>
        <p className="text-gray-600">{stats?.ad_category || ''}</p>
        {stats?.website_url && (
          <p className="text-sm text-gray-500 mt-1">
            Tracking: {stats.website_url}
          </p>
        )}
      </div>

      {/* Real-time Data Indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2">
        <span className="text-green-600 text-xl">✓</span>
        <span className="text-green-800 font-medium">Connected to live statistics from webflyers.uk</span>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Clicks</p>
          <p className="text-3xl font-bold mt-2 text-navy-800">{totalClicks}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">This Week</p>
          <p className="text-3xl font-bold mt-2 text-navy-800">{clicksWeek}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Today</p>
          <p className="text-3xl font-bold mt-2 text-navy-800">{clicksToday}</p>
        </div>
      </div>

      {/* No Data Message */}
      {!hasData && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <p className="text-gray-700">No clicks recorded yet. Statistics will appear once your ad receives traffic on webflyers.uk.</p>
        </div>
      )}

      {/* Daily Clicks Chart */}
      {hasData && stats.daily_data && stats.daily_data.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-navy-800">Clicks - Last 30 Days</h2>
          <div className="h-64">
            <SimpleLineChart data={stats.daily_data} />
          </div>
        </div>
      )}

      {/* Device Breakdown */}
      {hasData && stats.device_breakdown && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-navy-800">Device Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Mobile</span>
              <span className="font-semibold text-navy-800">{stats.device_breakdown.mobile}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${stats.device_breakdown.mobile}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-700">Desktop</span>
              <span className="font-semibold text-navy-800">{stats.device_breakdown.desktop}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-cyan-600 h-2 rounded-full" 
                style={{ width: `${stats.device_breakdown.desktop}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Ad Details */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="font-semibold mb-3 text-navy-800">Ad Period</h3>
        <p className="text-gray-600">
          {stats?.start_date || 'N/A'} to {stats?.end_date || 'Ongoing'}
        </p>
      </div>
    </div>
  );
};

// Simple Line Chart Component
const SimpleLineChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.clicks), 1);
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
          stroke="#0891b2"
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
              fill="#0891b2"
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