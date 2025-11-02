# Big Data Technologies Setup Guide

This guide shows how to integrate each big data technology into RecoHub.

## 1. NoSQL - MongoDB ✅ (Already Implemented)

**Location**: `backend/models/`, `backend/routes/`

**Usage**:
- Stores all content metadata (movies, songs, books, series)
- Stores user profiles and ratings
- Handles unstructured/semi-structured data

**Example**:
```javascript
// backend/models/Movie.js - Document-based storage
const movieSchema = new mongoose.Schema({
  title: String,
  genres: [String],  // Flexible schema
  // ... other fields
});
```

## 2. HDFS (Hadoop Distributed File System)

**Purpose**: Store large unstructured files (videos, images, PDFs, audio)

**Setup**:
```bash
# Install Hadoop
brew install hadoop  # macOS
# or download from https://hadoop.apache.org

# Configure Hadoop
# Edit hadoop/etc/hadoop/core-site.xml
# Edit hadoop/etc/hadoop/hdfs-site.xml

# Format HDFS
hdfs namenode -format

# Start HDFS
start-dfs.sh

# Create directories
hadoop fs -mkdir -p /user/recohub/unstructured/{images,videos,audio,pdfs}
```

**Upload Files**:
```bash
hadoop fs -put datasets/unstructured/images/* /user/recohub/unstructured/images/
hadoop fs -put datasets/unstructured/videos/* /user/recohub/unstructured/videos/
```

**In Code**: File paths stored in MongoDB, actual files in HDFS

## 3. Apache Spark

**Purpose**: Process large datasets, run ML algorithms

**Setup**:
```bash
# Install Spark
brew install apache-spark

# Install MongoDB connector
spark-shell --packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1
```

**File**: `spark/recommendations.py`

**Usage**:
```bash
# Run Spark job
spark-submit --packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1 \
  spark/recommendations.py
```

## 4. Apache Kafka

**Purpose**: Real-time streaming of user events

**Setup**:
```bash
# Install Kafka
brew install kafka  # macOS
# or download from https://kafka.apache.org/downloads

# Start Zookeeper
zookeeper-server-start /usr/local/etc/kafka/zookeeper.properties

# Start Kafka
kafka-server-start /usr/local/etc/kafka/server.properties

# Create topics
kafka-topics --create --bootstrap-server localhost:9092 \
  --replication-factor 1 --partitions 1 --topic user-ratings

kafka-topics --create --bootstrap-server localhost:9092 \
  --replication-factor 1 --partitions 1 --topic user-activities
```

**Integration**: 
- File: `kafka/producer.js`
- Add to `backend/package.json`: `"kafkajs": "^2.2.4"`
- Integrate in rating routes

## 5. Flume

**Purpose**: Ingest user activity logs

**Setup**:
```bash
# Install Flume
brew install flume

# Configure: flume/flume.conf (already created)

# Start Flume agent
flume-ng agent -n agent -f flume/flume.conf -Dflume.root.logger=INFO,console
```

**Usage**: Monitors log files and sends to HDFS/Kafka

## 6. Hive/HiveQL

**Purpose**: SQL-like queries on HDFS data

**Setup**:
```bash
# Install Hive
brew install hive

# Initialize Hive schema
schematool -initSchema -dbType derby

# Start Hive
hive
```

**File**: `hive/queries.hql`

**Usage**:
```bash
hive -f hive/queries.hql
```

## 7. Sqoop

**Purpose**: Import/Export data between MongoDB and HDFS

**Setup**:
```bash
# Install Sqoop
brew install sqoop

# Download MongoDB connector
# https://github.com/mongodb/mongo-hadoop

# Configure sqoop/import.sh
```

**File**: `sqoop/import.sh`

**Usage**:
```bash
chmod +x sqoop/import.sh
./sqoop/import.sh
```

## 8. HBase

**Purpose**: Fast lookups for trending items

**Setup**:
```bash
# Install HBase
brew install hbase

# Configure hbase/conf/hbase-site.xml

# Start HBase
start-hbase.sh

# Start HBase shell
hbase shell
```

**Usage**:
```bash
# Create table
create 'trending_items', 'movies', 'songs', 'books', 'series'

# Store trending items from Spark
```

## Integration Architecture

```
User Action → Express API → MongoDB
                      ↓
                 Kafka Producer
                      ↓
                 Kafka Topic
                      ↓
            ┌─────────┴─────────┐
            ↓                   ↓
        Spark Streaming    Flume → HDFS
            ↓                   ↓
      Recommendations      Batch Processing
            ↓                   ↓
         MongoDB ←───────── Spark ML
            ↓
         HBase (Fast Cache)
```

## Quick Start All Services

```bash
# Terminal 1: MongoDB (already running)
mongod

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: HDFS
start-dfs.sh

# Terminal 4: Zookeeper
zookeeper-server-start zookeeper.properties

# Terminal 5: Kafka
kafka-server-start server.properties

# Terminal 6: Flume
flume-ng agent -n agent -f flume/flume.conf

# Terminal 7: Spark (when needed)
spark-submit spark/recommendations.py
```

## Where Each Technology is Used

| Technology | File Location | Purpose |
|------------|---------------|---------|
| **MongoDB** | `backend/models/*.js` | Primary NoSQL database |
| **HDFS** | `datasets/unstructured/` | Store large files |
| **Spark** | `spark/recommendations.py` | ML processing |
| **Kafka** | `kafka/producer.js` | Real-time streaming |
| **Flume** | `flume/flume.conf` | Data ingestion |
| **Hive** | `hive/queries.hql` | Analytics queries |
| **Sqoop** | `sqoop/import.sh` | Data transfer |
| **HBase** | (To be implemented) | Fast lookups |

