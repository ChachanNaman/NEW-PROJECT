# Quick Start Guide - After Installing Everything

## Once All Tools Are Installed

### 1. Start All Services

```bash
# Terminal 1: Start HDFS
$HADOOP_HOME/sbin/start-dfs.sh

# Terminal 2: Start Kafka
zookeeper-server-start $KAFKA_HOME/config/zookeeper.properties > /tmp/zookeeper.log 2>&1 &
sleep 5
kafka-server-start $KAFKA_HOME/config/server.properties > /tmp/kafka.log 2>&1 &

# Terminal 3: Start HBase
start-hbase.sh
```

### 2. Export Your MongoDB Data to HDFS

Since you've already uploaded data to MongoDB, let's export it:

```bash
# Export movies collection to JSON
mongosh mongodb://localhost:27017/recohub --quiet --eval "printjson(db.movies.find().toArray())" > ~/Desktop/RecoHub/datasets/exported_movies.json

# Export songs
mongosh mongodb://localhost:27017/recohub --quiet --eval "printjson(db.songs.find().toArray())" > ~/Desktop/RecoHub/datasets/exported_songs.json

# Export books
mongosh mongodb://localhost:27017/recohub --quiet --eval "printjson(db.books.find().toArray())" > ~/Desktop/RecoHub/datasets/exported_books.json

# Upload to HDFS
hdfs dfs -mkdir -p /user/recohub/datasets
hdfs dfs -put ~/Desktop/RecoHub/datasets/exported_*.json /user/recohub/datasets/

# Verify
hdfs dfs -ls /user/recohub/datasets/
```

### 3. Process Data with Spark

```bash
cd ~/Desktop/RecoHub/spark
spark-submit --packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1 recommendations.py
```

### 4. Run Hive Queries

```bash
hive -f ~/Desktop/RecoHub/hive/queries.hql
```

### 5. Test Kafka (Send Events)

```bash
# In backend directory, install kafkajs
cd ~/Desktop/RecoHub/backend
npm install

# Test Kafka producer
node -e "const kafka = require('./kafka/producer'); kafka.connect().then(() => kafka.sendRatingEvent('test-user', 'movie', 'test-id', 5));"
```

## Daily Workflow

1. **Start MongoDB** (if not running): Already running via Compass
2. **Start HDFS**: `$HADOOP_HOME/sbin/start-dfs.sh`
3. **Start Kafka**: Use the commands above
4. **Start your backend**: `cd backend && npm run dev`
5. **Start your frontend**: `cd frontend && npm run dev`

## For Your Presentation

You can demonstrate:
1. ✅ Data in MongoDB (via Compass)
2. ✅ Data in HDFS (via `hdfs dfs -ls`)
3. ✅ Spark processing (run spark-submit)
4. ✅ Kafka streaming (show topics)
5. ✅ Hive queries (run queries.hql)

