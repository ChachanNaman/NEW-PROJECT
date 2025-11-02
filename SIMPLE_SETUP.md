# Super Simple Setup - Just Spark & Power BI

## What You Already Have ✅
- MongoDB with datasets (movies, songs, books)
- Backend (Node.js)
- Frontend (React)
- ML API (Python)

## What You Need: Just 2 Things

### 1. Apache Spark (For Big Data Processing Demo)
Process your datasets to show big data processing

### 2. Export to CSV (For Power BI)
Export MongoDB data to CSV files for Power BI analysis

---

## Step 1: Install Java (Required for Spark)

```bash
# Install Java
brew install openjdk@11

# Add to PATH
echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@11' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify
java -version
```

## Step 2: Install Spark

```bash
# Install Spark
brew install apache-spark

# Verify it works
spark-shell --version
```

That's it! Spark is ready. ✅

## Step 3: Export MongoDB to CSV for Power BI

Run this script to export your data:

```bash
cd ~/Desktop/RecoHub/backend
node scripts/exportToCSV.js
```

This creates CSV files in `datasets/exports/` that you can import into Power BI!

## Step 4: Process Data with Spark

Run this to show big data processing:

```bash
cd ~/Desktop/RecoHub/spark
spark-submit processData.py
```

This processes your datasets and creates results - perfect for demo! ✅

---

## Summary

1. ✅ MongoDB - Your data is already there
2. ✅ Spark - Process your datasets  
3. ✅ CSV Export - For Power BI
4. ✅ Done!

No streaming, no complex setup, just what you need!
