import React, { useEffect, useRef } from 'react';

const PowerBIVisual = ({ embedUrl, accessToken, reportId, pageName, visualName }) => {
  const embedContainer = useRef(null);

  useEffect(() => {
    if (!embedUrl || !accessToken) {
      console.warn('Power BI: Missing embed URL or access token');
      return;
    }

    // Load Power BI JavaScript SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/powerbi-client@2.21.1/dist/powerbi.min.js';
    script.onload = () => {
      embedReport();
    };
    document.body.appendChild(script);

    function embedReport() {
      if (!window.powerbi) {
        console.error('Power BI SDK not loaded');
        return;
      }

      const config = {
        type: 'report',
        tokenType: window.powerbi.models.TokenType.Embed,
        accessToken: accessToken,
        embedUrl: embedUrl,
        id: reportId,
        permissions: window.powerbi.models.Permissions.All,
        settings: {
          panes: {
            filters: {
              expanded: false,
              visible: false
            },
            pageNavigation: {
              visible: false
            }
          },
          background: window.powerbi.models.BackgroundType.Transparent,
        }
      };

      if (pageName) {
        config.pageName = pageName;
      }

      if (visualName) {
        config.visualName = visualName;
      }

      const report = window.powerbi.embed(embedContainer.current, config);

      // Handle events
      report.on('loaded', () => {
        console.log('Power BI report loaded');
      });

      report.on('error', (event) => {
        console.error('Power BI error:', event.detail);
      });
    }

    return () => {
      // Cleanup
      if (embedContainer.current && window.powerbi) {
        window.powerbi.reset(embedContainer.current);
      }
    };
  }, [embedUrl, accessToken, reportId, pageName, visualName]);

  return (
    <div className="w-full h-full">
      <div 
        ref={embedContainer} 
        className="w-full h-screen"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
};

export default PowerBIVisual;

