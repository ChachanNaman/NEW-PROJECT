# Power BI Integration in Your Website

## Overview

This guide shows how to embed Power BI dashboards directly in your RecoHub website using React.

## Method 1: Public Embed (Simplest - Recommended)

### Step 1: Publish Your Power BI Report

1. **Open Power BI Desktop**
2. **File → Publish → Publish to Power BI**
   - Sign in with your Microsoft account (free account works)
   - Choose workspace (or create "My workspace")
   - Click "Publish"

3. **Get Public Embed URL**
   - Go to: https://app.powerbi.com/
   - Open your report
   - Click **"..." (More options)** → **Embed report**
   - Click **"Embed** → Select **"Publish to web (public)**
   - Click **"Create embed code"**
   - Copy the **iframe src URL**

### Step 2: Add to Your Website

1. **Update `.env` file in backend:**
```bash
cd ~/Desktop/RecoHub/backend
# Add to .env file:
POWER_BI_PUBLIC_EMBED_URL=https://app.powerbi.com/view?r=YOUR_EMBED_CODE_HERE
```

2. **Restart your backend:**
```bash
npm run dev
```

3. **Access Analytics page:**
   - Open: http://localhost:3000/analytics
   - Power BI dashboard will be embedded!

## Method 2: Authenticated Embed (More Secure)

### Step 1: Register Power BI App

1. Go to: https://portal.azure.com/
2. **Azure Active Directory** → **App registrations** → **New registration**
3. Name: "RecoHub Power BI"
4. Redirect URI: `http://localhost:5001`
5. Click **Register**
6. **API permissions** → **Add a permission** → **Power BI Service** → **Delegated permissions** → Select all
7. **Certificates & secrets** → **New client secret** → Copy the secret
8. Copy:
   - **Application (client) ID**
   - **Directory (tenant) ID**
   - **Client secret**

### Step 2: Configure Backend

1. **Update `.env` file:**
```bash
POWER_BI_CLIENT_ID=your-client-id
POWER_BI_CLIENT_SECRET=your-client-secret
POWER_BI_TENANT_ID=your-tenant-id
POWER_BI_WORKSPACE_ID=your-workspace-id
POWER_BI_REPORT_ID=your-report-id
```

2. **Get Workspace ID and Report ID:**
   - Go to: https://app.powerbi.com/
   - Open your workspace
   - Look at URL: `.../groups/{WORKSPACE_ID}/reports/{REPORT_ID}`

### Step 3: Use Authenticated Embed

The backend will automatically generate embed tokens. Just access:
- http://localhost:3000/analytics

## Method 3: Simple iframe Embed (Easiest)

If you just want a quick embed without backend:

1. **Create Power BI Public Report** (Method 1, Step 1)

2. **Add to React component directly:**

Create `frontend/src/components/PowerBIEmbed.jsx`:
```jsx
import React from 'react';

const PowerBIEmbed = () => {
  const embedUrl = 'YOUR_PUBLIC_EMBED_URL_HERE';
  
  return (
    <div className="w-full h-screen">
      <iframe
        title="Power BI Dashboard"
        width="100%"
        height="100%"
        src={embedUrl}
        frameBorder="0"
        allowFullScreen={true}
      />
    </div>
  );
};

export default PowerBIEmbed;
```

3. **Use in your pages:**
```jsx
import PowerBIEmbed from '../components/PowerBIEmbed';

// In your component:
<PowerBIEmbed />
```

## Quick Start (Recommended)

### Simplest Approach:

1. **Publish report to Power BI** (create free account if needed)
2. **Get public embed URL**
3. **Add to `frontend/src/components/PowerBIEmbed.jsx`** (see Method 3)
4. **Add Analytics link to navigation**

That's it! No backend configuration needed.

## Features

### What You Can Do:

✅ **Embed multiple reports** - Different dashboards for Movies, Songs, Books
✅ **Switch between reports** - Tabs/buttons to switch views
✅ **Filter integration** - Filter data from your React app
✅ **Responsive** - Works on mobile and desktop
✅ **Interactive** - Users can interact with Power BI visuals

### Navigation Integration

The Analytics page is already added to your sidebar! Just click "📊 Analytics" to see Power BI dashboards.

## Troubleshooting

### Issue: "Power BI embed not configured"
**Solution**: Add `POWER_BI_PUBLIC_EMBED_URL` to backend `.env` or use Method 3

### Issue: "Access denied"
**Solution**: 
- For public embed: Make sure report is published as public
- For authenticated: Check client ID/secret in `.env`

### Issue: Dashboard not loading
**Solution**:
- Check browser console for errors
- Verify embed URL is correct
- Make sure Power BI SDK is loaded

## Example Dashboard Setup

### Create Multiple Dashboards:

1. **Overview Dashboard** (Page: "Overview")
   - All content types overview
   - Total counts, average ratings

2. **Movies Dashboard** (Page: "Movies")
   - Movies-specific visuals
   - Genre analysis, director stats

3. **Songs Dashboard** (Page: "Songs")
   - Songs-specific visuals
   - Artist analysis, popularity trends

4. **Books Dashboard** (Page: "Books")
   - Books-specific visuals
   - Author analysis, genre distribution

5. **Ratings Dashboard** (Page: "Ratings")
   - Cross-domain rating analysis
   - User activity, rating distribution

### Switch Between Dashboards:

The Analytics page already has tabs to switch between different report pages!

## Power BI Report Tips

1. **Optimize for Web**:
   - Use responsive visuals
   - Keep visuals simple
   - Limit number of visuals per page

2. **Fast Loading**:
   - Pre-filter data
   - Use summary tables
   - Remove unnecessary visuals

3. **Mobile Friendly**:
   - Power BI auto-optimizes for mobile
   - Test on mobile viewport

## Security Notes

- **Public embeds** are visible to anyone with the URL
- **Authenticated embeds** require login (more secure)
- For production, use authenticated embeds
- For demo/presentation, public embeds are fine

---

## Summary

**Easiest Method** (Recommended for demo):
1. Publish report to Power BI (free account)
2. Get public embed URL
3. Use iframe in React component
4. Done! ✅

**Professional Method** (For production):
1. Set up Azure App Registration
2. Configure backend with credentials
3. Use Power BI SDK for authenticated embedding
4. More secure, more features ✅

Your website now has Power BI dashboards embedded! 🎉

