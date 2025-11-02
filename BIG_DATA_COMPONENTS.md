# Big Data Components in RecoHub

## Current Big Data Usage

### 1. **MongoDB (NoSQL Database)**
- **Location**: Used throughout the backend as the primary database
- **Big Data Aspect**: 
  - Stores unstructured/semi-structured data (movies, songs, books, series with variable schemas)
  - Handles large datasets efficiently with indexing
  - Sharding capability for horizontal scaling
  - Document-based storage suitable for recommendation data

### 2. **Large Dataset Processing**
- **Current**: Sample seed data (24 items total)
- **Required**: Import large datasets from Kaggle (MovieLens, Goodreads, Spotify)
- **Files**: `backend/scripts/importKaggleDatasets.js` (to be created)

## Proposed Big Data Architecture Enhancements

### For Big Data Course Integration:

1. **HDFS (Hadoop Distributed File System)**
   - Store raw datasets from Kaggle
   - Distribute data across multiple nodes
   
2. **Apache Spark**
   - Process large recommendation datasets
   - Run ML algorithms on distributed data
   - Replace/supplement current Python ML API
   
3. **Kafka**
   - Real-time user activity streaming
   - Rating events streaming
   - Real-time recommendation updates
   
4. **Hive/HiveQL**
   - Query large datasets stored in HDFS
   - Analytics and reporting
   
5. **Flume**
   - Ingest user interaction data (clicks, views, ratings)
   - Stream data to Kafka or HDFS
   
6. **Sqoop**
   - Import/Export data between MongoDB and HDFS
   - ETL operations
   
7. **HBase**
   - Store real-time recommendation results
   - Fast lookups for trending items

## Dataset Requirements

Your project needs:
- **Unstructured data**: Video files, images, audio files, PDFs
- **Large datasets**: MovieLens (ratings), Goodreads (book data), Spotify (audio features)
- **JSON datasets**: Import large JSON files into MongoDB

## Integration Points

1. **Data Ingestion Layer**: Kafka + Flume
2. **Storage Layer**: MongoDB + HDFS + HBase
3. **Processing Layer**: Spark for ML/Analytics
4. **Query Layer**: Hive for analytics, MongoDB for real-time queries
5. **ETL Layer**: Sqoop for data movement
