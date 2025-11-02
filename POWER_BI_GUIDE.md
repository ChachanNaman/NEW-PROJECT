# Power BI Integration Guide

## Step 1: Export Data to CSV

```bash
cd ~/Desktop/RecoHub/backend
node scripts/exportToCSV.js
```

This creates CSV files in `datasets/exports/`:
- `movies.csv`
- `songs.csv`
- `books.csv`
- `series.csv`
- `ratings.csv`

## Step 2: Import into Power BI

1. **Open Power BI Desktop**

2. **Get Data → Text/CSV**
   - Navigate to `~/Desktop/RecoHub/datasets/exports/`
   - Select `movies.csv`
   - Click "Load"

3. **Import All Files**
   - Repeat for: songs.csv, books.csv, series.csv, ratings.csv
   - Or use "Get Data" → "Folder" to import all at once

## Step 3: Create Visualizations

### Movies Dashboard
- **Bar Chart**: Top 10 movies by rating
- **Pie Chart**: Movies by genre
- **Line Chart**: Movies released by year

### Songs Dashboard
- **Table**: Top artists by song count
- **Column Chart**: Average popularity by genre
- **Card**: Total songs count

### Books Dashboard
- **Bar Chart**: Top authors by book count
- **Treemap**: Books by genre
- **Line Chart**: Books published by year

### Ratings Analysis
- **Matrix**: Ratings by content type
- **Gauge**: Average rating
- **Donut Chart**: Rating distribution (1-5 stars)

## Step 4: Combine Data

Create relationships:
- Movies ↔ Ratings (by contentId)
- Songs ↔ Ratings (by contentId)
- Books ↔ Ratings (by contentId)

Then create cross-content visualizations!

## Example Power BI Queries

### DAX Measures:

```dax
Total Content = COUNTROWS(Movies) + COUNTROWS(Songs) + COUNTROWS(Books)

Average Rating All = 
DIVIDE(
    SUM(Ratings[rating]),
    COUNTROWS(Ratings)
)

Top Rated Content = 
CALCULATE(
    MAX(Movies[title]),
    FILTER(Movies, Movies[averageRating] >= 4.5)
)
```

## Export Visualizations

- Save as PDF for your presentation
- Export as images
- Publish to Power BI Service (if needed)

---

**That's it!** Your MongoDB data is now in Power BI with beautiful visualizations! 📊

