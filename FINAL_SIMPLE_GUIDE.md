# 🎯 Final Simple Guide - Just What You Need

## Your Tech Stack (Simple Version)

1. ✅ **MongoDB** - Data storage (DONE - datasets uploaded)
2. ✅ **Apache Spark** - Big data processing
3. ✅ **Node.js/Express** - Backend (DONE)
4. ✅ **React.js** - Frontend (DONE)
5. ✅ **Python FastAPI** - ML API (DONE)
6. ✅ **Power BI** - Data visualization

## Setup Steps (Super Simple!)

### Step 1: Install Java (5 minutes)

```bash
brew install openjdk@11
echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@11' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
java -version
```

### Step 2: Install Spark (5 minutes)

```bash
brew install apache-spark
spark-shell --version
```

### Step 3: Install Python Dependencies (2 minutes)

```bash
cd ~/Desktop/RecoHub/spark
pip install pyspark pymongo
```

### Step 4: Export to CSV for Power BI (30 seconds)

```bash
cd ~/Desktop/RecoHub/backend
node scripts/exportToCSV.js
```

Files will be in `datasets/exports/` - ready for Power BI!

### Step 5: Process with Spark (30 seconds)

```bash
cd ~/Desktop/RecoHub/spark
spark-submit processData.py
```

This shows big data processing on your datasets!

## What You Can Show in Presentation

### 1. MongoDB (Already Done)
- Open MongoDB Compass
- Show your collections (movies, songs, books)
- Show data count

### 2. Spark Processing
- Run: `spark-submit spark/processData.py`
- Shows data analysis
- Shows big data processing capability

### 3. Power BI
- Import CSV files from `datasets/exports/`
- Create dashboards
- Show visualizations

### 4. Full Stack Demo
- Backend API: `npm run dev` (port 5001)
- Frontend: `npm run dev` (port 3000)
- ML API: `python main.py` (port 8000)
- Show working recommendation system

## Presentation Flow

1. **Introduction**: Multi-domain recommendation system
2. **Tech Stack**: Show MongoDB, Spark, React, Node.js
3. **Data**: Show datasets in MongoDB Compass
4. **Processing**: Run Spark script (shows big data processing)
5. **Visualization**: Show Power BI dashboards
6. **Demo**: Show working app (login, browse, rate, recommendations)

## Files Created

- ✅ `backend/scripts/exportToCSV.js` - Export for Power BI
- ✅ `spark/processData.py` - Simple Spark processing
- ✅ `spark/requirements.txt` - Python dependencies
- ✅ `POWER_BI_GUIDE.md` - How to use Power BI

## That's It!

- No complex Hadoop setup
- No streaming needed
- Just Spark + MongoDB + Power BI
- Simple and works!

Total setup time: ~15 minutes! 🚀

