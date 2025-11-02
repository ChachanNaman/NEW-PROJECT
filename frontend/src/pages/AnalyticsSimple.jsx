import React from 'react';
import Layout from '../components/Layout';
import PowerBIEmbed from '../components/PowerBIEmbed';

/**
 * Simple Analytics Page using Power BI Embed
 * 
 * To configure:
 * 1. Add REACT_APP_POWER_BI_EMBED_URL to .env file
 * 2. Or modify embedUrl in PowerBIEmbed component
 */
const AnalyticsSimple = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Interactive Power BI visualizations embedded in RecoHub
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <PowerBIEmbed 
            embedUrl={process.env.REACT_APP_POWER_BI_EMBED_URL}
            title="RecoHub Analytics"
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 How to Add Your Power BI Dashboard:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>Publish your report to Power BI (app.powerbi.com)</li>
            <li>Click "..." → "Embed report" → "Publish to web"</li>
            <li>Copy the iframe URL</li>
            <li>Add to <code className="bg-blue-100 px-1 rounded">frontend/.env</code>: <code>REACT_APP_POWER_BI_EMBED_URL=your-url</code></li>
            <li>Restart frontend: <code>npm run dev</code></li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsSimple;

