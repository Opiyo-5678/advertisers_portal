import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyAdsWithStats = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAdsAndStats();
  }, []);

  const fetchAdsAndStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all ads with statistics
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/advertisers/ads/statistics/all/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setAds(response.data.ads);
      setStats({
        total_ads: response.data.total_ads,
        total_clicks: response.data.total_clicks,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching ads:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Advertisements</h1>

      {/* Summary */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Total Live Ads</p>
            <p className="text-2xl font-bold">{stats.total_ads}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Total Clicks</p>
            <p className="text-2xl font-bold">{stats.total_clicks}</p>
          </div>
        </div>
      )}

      {/* Ads Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Ad Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total Clicks</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No ads found
                </td>
              </tr>
            ) : (
              ads.map((ad) => (
                <tr key={ad.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{ad.title}</td>
                  <td className="px-6 py-4">{ad.category}</td>
                  <td className="px-6 py-4 font-semibold">{ad.total_clicks}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      ad.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/ads/${ad.id}/statistics`}
                      className="text-blue-600 hover:underline"
                    >
                      View Statistics
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAdsWithStats;