# How to Upload Your Dataset to RecoHub

## Step 1: Prepare Your Dataset

1. **Organize your dataset files**:
   - Place JSON/CSV files in the appropriate folder:
     - Movies → `datasets/movies/`
     - Songs → `datasets/songs/`
     - Books → `datasets/books/`
     - Series → `datasets/series/`
   
2. **For unstructured files** (images, videos, PDFs, audio):
   - Store in `datasets/unstructured/`
   - Supported formats:
     - Images: `.jpg`, `.png`, `.gif` (movie posters, book covers)
     - Videos: `.mp4`, `.avi` (trailers)
     - Audio: `.mp3`, `.wav` (song previews)
     - Documents: `.pdf` (book PDFs)

## Step 2: Upload to MongoDB

### Option A: Using the Import Script (Recommended)

```bash
cd ~/Desktop/RecoHub/backend
node scripts/importDataset.js ../datasets/movies/your_movies.json movies
node scripts/importDataset.js ../datasets/songs/your_songs.json songs
node scripts/importDataset.js ../datasets/books/your_books.json books
```

### Option B: Using MongoDB Compass or mongoimport

```bash
# Import JSON file directly
mongoimport --uri "mongodb://localhost:27017/recohub" \
  --collection movies \
  --file datasets/movies/your_movies.json \
  --jsonArray

mongoimport --uri "mongodb://localhost:27017/recohub" \
  --collection songs \
  --file datasets/songs/your_songs.json \
  --jsonArray
```

### Option C: Using MongoDB Compass GUI
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `recohub` database
4. Click "ADD DATA" → "Import File"
5. Select your JSON/CSV file
6. Map fields and import

## Step 3: Upload to HDFS (For Big Data Processing)

After importing to MongoDB, also store in HDFS for Spark processing:

```bash
# Start Hadoop (if not running)
start-dfs.sh

# Create directory in HDFS
hadoop fs -mkdir -p /user/recohub/datasets

# Upload structured data (JSON/CSV)
hadoop fs -put datasets/movies/*.json /user/recohub/datasets/movies/
hadoop fs -put datasets/songs/*.json /user/recohub/datasets/songs/

# Upload unstructured data (images, videos, PDFs, audio)
hadoop fs -put datasets/unstructured/images/ /user/recohub/unstructured/images/
hadoop fs -put datasets/unstructured/videos/ /user/recohub/unstructured/videos/
hadoop fs -put datasets/unstructured/audio/ /user/recohub/unstructured/audio/
hadoop fs -put datasets/unstructured/pdfs/ /user/recohub/unstructured/pdfs/

# Verify upload
hadoop fs -ls -R /user/recohub/
```

## Step 4: Verify Upload

### Check MongoDB:
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/recohub

# Check collections
show collections

# Count documents
db.movies.countDocuments()
db.songs.countDocuments()
db.books.countDocuments()
```

### Check HDFS:
```bash
hadoop fs -ls /user/recohub/datasets/
hadoop fs -du -h /user/recohub/unstructured/
```

## Step 5: Process Data with Spark

After data is in HDFS, process with Spark:

```bash
cd ~/Desktop/RecoHub/spark
spark-submit --packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1 \
  recommendations.py
```

## Dataset Format Requirements

### JSON Format Example:
```json
[
  {
    "title": "Movie Title",
    "description": "Movie description",
    "genres": ["Action", "Drama"],
    "releaseYear": 2020,
    "director": "Director Name",
    "cast": ["Actor1", "Actor2"],
    "duration": 120,
    "averageRating": 4.5,
    "ratingCount": 1000
  }
]
```

### CSV Format Example:
```
title,description,genres,releaseYear,director
"Movie Title","Description","Action|Drama",2020,"Director Name"
```

## Troubleshooting

1. **File too large**: Split into smaller chunks or use streaming import
2. **Memory errors**: Increase MongoDB or Node.js memory limits
3. **Connection errors**: Ensure MongoDB and Hadoop are running
4. **Format errors**: Check JSON/CSV format validity

## Next Steps

After uploading:
1. Run Spark preprocessing: `spark-submit spark/preprocessing.py`
2. Start Kafka for streaming: Follow Kafka setup guide
3. Run Flume for data ingestion: `flume-ng agent -f flume/flume.conf -n agent`
4. Query with Hive: `hive -f hive/queries.hql`

