const express = require('express');
const axios = require('axios');
const router = express.Router();

// Power BI configuration
const POWER_BI_CLIENT_ID = process.env.POWER_BI_CLIENT_ID || '';
const POWER_BI_CLIENT_SECRET = process.env.POWER_BI_CLIENT_SECRET || '';
const POWER_BI_TENANT_ID = process.env.POWER_BI_TENANT_ID || '';
const POWER_BI_WORKSPACE_ID = process.env.POWER_BI_WORKSPACE_ID || '';
const POWER_BI_REPORT_ID = process.env.POWER_BI_REPORT_ID || '';

/**
 * Get Power BI access token (Service Principal)
 */
async function getPowerBIToken() {
  try {
    const tokenUrl = `https://login.microsoftonline.com/${POWER_BI_TENANT_ID}/oauth2/v2.0/token`;
    
    const params = new URLSearchParams();
    params.append('client_id', POWER_BI_CLIENT_ID);
    params.append('client_secret', POWER_BI_CLIENT_SECRET);
    params.append('scope', 'https://analysis.windows.net/powerbi/api/.default');
    params.append('grant_type', 'client_credentials');

    const response = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Power BI token:', error);
    throw error;
  }
}

/**
 * Get embed token for a report
 */
router.get('/embed-token/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const accessToken = await getPowerBIToken();

    // Get report details
    const reportUrl = `https://api.powerbi.com/v1.0/myorg/groups/${POWER_BI_WORKSPACE_ID}/reports/${reportId}`;
    const reportResponse = await axios.get(reportUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const embedUrl = reportResponse.data.embedUrl;

    // Generate embed token
    const tokenUrl = `https://api.powerbi.com/v1.0/myorg/groups/${POWER_BI_WORKSPACE_ID}/reports/${reportId}/GenerateToken`;
    const tokenResponse = await axios.post(
      tokenUrl,
      {
        accessLevel: 'View',
        allowSaveAs: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({
      embedUrl,
      accessToken: tokenResponse.data.token,
      reportId,
      expiry: tokenResponse.data.expiration,
    });
  } catch (error) {
    console.error('Error getting embed token:', error);
    res.status(500).json({ 
      message: 'Failed to get Power BI embed token',
      error: error.message 
    });
  }
});

/**
 * Simple method: Get embed info (if using public embed)
 */
router.get('/embed-info', async (req, res) => {
  try {
    // For public embedding (no authentication required)
    // You can publish report as public and use public embed URL
    const publicEmbedUrl = process.env.POWER_BI_PUBLIC_EMBED_URL || '';
    
    if (!publicEmbedUrl) {
      return res.status(400).json({ 
        message: 'Power BI public embed URL not configured' 
      });
    }

    res.json({
      embedUrl: publicEmbedUrl,
      reportId: POWER_BI_REPORT_ID,
      // No token needed for public embeds
    });
  } catch (error) {
    console.error('Error getting embed info:', error);
    res.status(500).json({ 
      message: 'Failed to get Power BI embed info',
      error: error.message 
    });
  }
});

module.exports = router;

