import React from 'react';

/**
 * Simple Power BI Embed Component
 * Uses iframe for easy public embedding
 * 
 * To use:
 * 1. Publish your Power BI report
 * 2. Get public embed URL from Power BI
 * 3. Replace embedUrl below
 */

const PowerBIEmbed = ({ embedUrl, title = "Power BI Dashboard" }) => {
  // Default embed URL - replace with your Power BI public embed URL
  const defaultEmbedUrl = embedUrl || process.env.REACT_APP_POWER_BI_EMBED_URL || '';

  if (!defaultEmbedUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Power BI Dashboard
          </h3>
          <p className="text-gray-600 mb-4">
            To embed a Power BI dashboard:
          </p>
          <ol className="text-left text-sm text-gray-600 space-y-2 mb-4">
            <li>1. Publish your report to Power BI</li>
            <li>2. Get the public embed URL</li>
            <li>3. Add to <code className="bg-gray-200 px-2 py-1 rounded">.env</code> as REACT_APP_POWER_BI_EMBED_URL</li>
            <li>4. Or replace embedUrl in component</li>
          </ol>
          <a
            href="https://app.powerbi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Go to Power BI →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <iframe
        title={title}
        width="100%"
        height="800px"
        src={defaultEmbedUrl}
        frameBorder="0"
        allowFullScreen={true}
        style={{
          minHeight: '600px',
          border: 'none',
        }}
      />
    </div>
  );
};

export default PowerBIEmbed;

