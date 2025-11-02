# Power BI Step-by-Step: Create Your First Dashboard

## Step 1: Export Data from MongoDB

```bash
cd ~/Desktop/RecoHub/backend
npm run export
```

This creates CSV files in `datasets/exports/`:
- ✅ movies.csv
- ✅ songs.csv  
- ✅ books.csv
- ✅ ratings.csv

## Step 2: Open Power BI Desktop

1. Download from: https://powerbi.microsoft.com/desktop/
2. Install and open Power BI Desktop

## Step 3: Import Data

### Import Movies:
1. Click **"Get Data"** → **"Text/CSV"**
2. Navigate to: `~/Desktop/RecoHub/datasets/exports/movies.csv`
3. Click **"Load"**

### Import Songs:
1. Click **"Get Data"** → **"Text/CSV"**
2. Navigate to: `~/Desktop/RecoHub/datasets/exports/songs.csv`
3. Click **"Load"**

### Import Books:
1. Click **"Get Data"** → **"Text/CSV"**
2. Navigate to: `~/Desktop/RecoHub/datasets/exports/books.csv`
3. Click **"Load"**

### Import Ratings:
1. Click **"Get Data"** → **"Text/CSV"**
2. Navigate to: `~/Desktop/RecoHub/datasets/exports/ratings.csv`
3. Click **"Load"**

## Step 4: Clean Data (If Needed)

1. Click **"Transform Data"** in Home ribbon
2. For each table:
   - Check data types (numbers, text, dates)
   - Fix any errors
   - Remove duplicates if any

## Step 5: Create Your First Visualization

### Visual 1: Total Content Count (Cards)

1. In Visualizations pane, click **Card** icon
2. In Fields pane, drag:
   - `Movies` table → Count of rows
   - Create 2 more cards for Songs and Books

### Visual 2: Top 5 Movies (Table)

1. Click **Table** icon
2. Drag fields:
   - `title` → Values
   - `averageRating` → Values (show as Average)
   - `ratingCount` → Values (show as Sum)
3. Click **Filter** icon on visual
4. Add filter: `averageRating` > 4.0
5. Sort by `averageRating` descending
6. Show top 5

### Visual 3: Movies by Genre (Pie Chart)

1. Click **Pie Chart** icon
2. Drag:
   - `genres` → Legend (may need to split genres column)
   - Count → Values
3. Format: Add data labels, colors

### Visual 4: Rating Distribution (Donut Chart)

1. Click **Donut Chart** icon
2. From `ratings` table:
   - `rating` → Legend
   - Count → Values

### Visual 5: Movies Released by Year (Line Chart)

1. Click **Line Chart** icon
2. Drag:
   - `releaseYear` → X-axis
   - Count → Y-axis
3. Format: Add markers, smooth lines

## Step 6: Format Your Dashboard

1. **Arrange visuals**: Drag and resize
2. **Add title**: Insert → Text box → "RecoHub Dashboard"
3. **Change colors**: Format → Theme
4. **Add filters**: Insert → Slicer
   - Add Year slicer
   - Add Genre slicer

## Step 7: Create More Dashboards

Create separate pages:
- Page 1: Overview (all content types)
- Page 2: Movies Analysis
- Page 3: Songs Analysis
- Page 4: Books Analysis
- Page 5: Ratings & Insights

## Step 8: Add Interactions

1. Select a visual
2. Format → Edit interactions
3. Set how other visuals respond when you click this one

## Step 9: Save Your Report

1. File → Save As
2. Name it: "RecoHub_Analysis.pbix"

## Step 10: Export for Presentation

### Option A: Export as PDF
1. File → Export → Export to PDF
2. Choose pages to export
3. Save PDF

### Option B: Export Visuals as Images
1. Right-click on visual
2. Export → Export visual as image
3. Save as PNG

### Option C: Publish to Power BI Service (Optional)
1. File → Publish → Publish to Power BI
2. Share link for online viewing

---

## Quick Tips

### Tip 1: Split Genres Column
If genres are in one cell separated by "; ":
1. Select `genres` column
2. Transform → Split Column → By Delimiter
3. Choose "; "
4. This creates multiple rows per movie (one per genre)

### Tip 2: Create Calculated Columns
1. Click "New Column" in Modeling tab
2. Write DAX:
```dax
Rating Category = 
IF(Movies[averageRating] >= 4.5, "Excellent",
IF(Movies[averageRating] >= 4.0, "Good",
IF(Movies[averageRating] >= 3.0, "Average", "Below Average")))
```

### Tip 3: Create Measures
1. Click "New Measure" in Modeling tab
2. Write DAX:
```dax
Total Content = COUNTROWS(Movies) + COUNTROWS(Songs) + COUNTROWS(Books)

Weighted Average = 
DIVIDE(
    SUMX(Movies, Movies[averageRating] * Movies[ratingCount]),
    SUM(Movies[ratingCount])
)
```

---

## Example Dashboard Layout

```
┌─────────────────────────────────────────────────┐
│          RecoHub Dashboard                      │
├─────────────────────────────────────────────────┤
│  [Total Movies]  [Total Songs]  [Total Books]  │
├─────────────────────────────────────────────────┤
│  [Top 5 Movies Table]    [Movies by Genre]     │
│                         (Pie Chart)            │
├─────────────────────────────────────────────────┤
│  [Rating Distribution]  [Movies by Year]      │
│  (Donut Chart)          (Line Chart)          │
├─────────────────────────────────────────────────┤
│  [Year Slicer]  [Genre Slicer]                 │
└─────────────────────────────────────────────────┘
```

---

**That's it! You now have a professional Power BI dashboard! 🎉**

