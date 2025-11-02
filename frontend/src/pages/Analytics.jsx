import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PowerBIVisual from '../components/PowerBIVisual';
import Layout from '../components/Layout';
import api from '../config/api';

const Analytics = () => {
  const [embedData, setEmbedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    fetchEmbedToken();
  }, [selectedReport]);

  const fetchEmbedToken = async () => {
    try {
      setLoading(true);
      // Option 1: Get embed token from backend (authenticated)
      const response = await axios.get(`${api.powerbi || 'http://localhost:5001/api/powerbi'}/embed-info`);
      setEmbedData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching Power BI embed:', err);
      // Fallback: Use public embed URL if configured
      const publicEmbedUrl = process.env.REACT_APP_POWER_BI_EMBED_URL;
      if (publicEmbedUrl) {
        setEmbedData({
          embedUrl: publicEmbedUrl,
          reportId: 'default',
        });
      } else {
        setError('Power BI embed not configured. Please configure in backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  const reports = [
    { id: 'overview', name: 'Overview Dashboard', pageName: 'Overview' },
    { id: 'movies', name: 'Movies Analysis', pageName: 'Movies' },
    { id: 'songs', name: 'Songs Analysis', pageName: 'Songs' },
    { id: 'books', name: 'Books Analysis', pageName: 'Books' },
    { id: 'ratings', name: 'Ratings Insights', pageName: 'Ratings' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Interactive Power BI visualizations embedded in RecoHub
          </p>
        </div>

        {/* Report Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedReport === report.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {report.name}
              </button>
            ))}
          </div>
        </div>

        {/* Power BI Embed Container */}
        <div className="bg-white rounded-lg shadow-md p-4">
          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Power BI dashboard...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800 mb-4">{error}</p>
              <div className="text-left bg-white p-4 rounded border border-red-200">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>To fix this:</strong>
                </p>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  <li>Publish your Power BI report</li>
                  <li>Get the public embed URL</li>
                  <li>Add to .env: POWER_BI_PUBLIC_EMBED_URL</li>
                </ol>
              </div>
            </div>
          )}

          {embedData && !loading && !error && (
            <PowerBIVisual
              embedUrl={embedData.embedUrl}
              accessToken={embedData.accessToken}
              reportId={embedData.reportId}
              pageName={reports.find(r => r.id === selectedReport)?.pageName}
            />
          )}

          {/* Alternative: Static Charts using Chart.js if Power BI not available */}
          {!embedData && !loading && (
            <div className="p-8 text-center text-gray-500">
              <p>Power BI integration not configured.</p>
              <p className="text-sm mt-2">
                See <code className="bg-gray-100 px-2 py-1 rounded">POWER_BI_INTEGRATION.md</code> for setup instructions.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;

