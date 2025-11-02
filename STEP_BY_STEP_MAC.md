# Step-by-Step Big Data Setup for macOS

## ✅ Step 1: You've Already Done
- ✅ Installed MongoDB
- ✅ Uploaded datasets (movies, songs, books) to MongoDB using Compass

## 📋 Step 2: Install Java (Required First!)

Open Terminal and run:

```bash
# Install Java 11
brew install openjdk@11

# Add to your shell profile
echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@11' >> ~/.zshrc
source ~/.zshrc

# Verify it works
java -version
```

**Expected output**: Should show Java version 11.x

## 📋 Step 3: Install Hadoop

```bash
# Install Hadoop
brew install hadoop

# Find where it installed
HADOOP_HOME=$(brew --prefix hadoop)/libexec
echo $HADOOP_HOME

# Create data directories
mkdir -p ~/hadoop-data/namenode
mkdir -p ~/hadoop-data/datanode
mkdir -p ~/hadoop-data/tmp

# Copy our config files
cd ~/Desktop/RecoHub
cp hadoop-config/*.xml $HADOOP_HOME/etc/hadoop/

# Format HDFS (ONLY DO THIS ONCE!)
$HADOOP_HOME/bin/hdfs namenode -format

# Start HDFS
$HADOOP_HOME/sbin/start-dfs.sh

# Verify it's running
jps
```

**You should see**: NameNode, DataNode, SecondaryNameNode

**Test HDFS**:
```bash
$HADOOP_HOME/bin/hdfs dfs -ls /
$HADOOP_HOME/bin/hdfs dfs -mkdir -p /user/recohub
```

## 📋 Step 4: Install Spark

```bash
# Install Spark
brew install apache-spark

# Test Spark
spark-shell --version

# Test in Spark shell
spark-shell
# Type: println("Hello Spark!")
# Type: :quit to exit
```

**Download MongoDB connector**:
```bash
cd ~/Desktop/RecoHub/spark
curl -O https://repo1.maven.org/maven2/org/mongodb/spark/mongo-spark-connector_2.12/3.0.1/mongo-spark-connector_2.12-3.0.1.jar
```

## 📋 Step 5: Install Kafka

```bash
# Install Kafka
brew install kafka

# Start Zookeeper (in background)
zookeeper-server-start /opt/homebrew/etc/kafka/zookeeper.properties > /tmp/zookeeper.log 2>&1 &

# Wait 5 seconds
sleep 5

# Start Kafka
kafka-server-start /opt/homebrew/etc/kafka/server.properties > /tmp/kafka.log 2>&1 &

# Wait 5 seconds
sleep 5

# Create topics
kafka-topics --create --bootstrap-server localhost:9092 \
  --replication-factor 1 --partitions 1 --topic user-ratings

kafka-topics --create --bootstrap-server localhost:9092 \
  --replication-factor 1 --partitions 1 --topic user-activities

# Verify topics created
kafka-topics --list --bootstrap-server localhost:9092
```

**You should see**: user-ratings, user-activities

## 📋 Step 6: Install Hive

```bash
# Install Hive
brew install hive

# Initialize Hive (first time only)
schematool -initSchema -dbType derby

# Test Hive
hive
# In Hive shell:
SHOW DATABASES;
# Type: exit; to quit
```

## 📋 Step 7: Install Flume

```bash
# Install Flume
brew install flume

# Verify
flume-ng version
```

## 📋 Step 8: Install Sqoop

```bash
# Install Sqoop
brew install sqoop

# Verify
sqoop version
```

## 📋 Step 9: Install HBase

```bash
# Install HBase
brew install hbase

# Start HBase
start-hbase.sh

# Test HBase
hbase shell
# Type: list
# Type: exit
```

## 📋 Step 10: Setup Environment Variables

Add this to `~/.zshrc`:

```bash
# Open editor
nano ~/.zshrc

# Add these lines at the end:
export JAVA_HOME=/opt/homebrew/opt/openjdk@11
export HADOOP_HOME=$(brew --prefix hadoop)/libexec
export SPARK_HOME=$(brew --prefix apache-spark)/libexec
export KAFKA_HOME=$(brew --prefix kafka)
export FLUME_HOME=$(brew --prefix flume)/libexec
export HIVE_HOME=$(brew --prefix hive)/libexec
export SQOOP_HOME=$(brew --prefix sqoop)/libexec
export HBASE_HOME=$(brew --prefix hbase)/libexec

export PATH=$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$SPARK_HOME/bin:$KAFKA_HOME/bin:$FLUME_HOME/bin:$HIVE_HOME/bin:$SQOOP_HOME/bin:$HBASE_HOME/bin:$PATH

# Save (Ctrl+O, Enter, Ctrl+X)

# Reload
source ~/.zshrc
```

## ✅ Verification Checklist

Run this to check everything:

```bash
echo "Java: $(java -version 2>&1 | head -1)"
echo "Hadoop: $(hadoop version 2>&1 | head -1)"
echo "Spark: $(spark-shell --version 2>&1 | head -1)"
echo "Kafka: $(kafka-topics --list --bootstrap-server localhost:9092 2>&1)"
echo "MongoDB: $(mongosh --version 2>&1 | head -1)"
```

## 🚀 Next: Use Your Datasets

### 1. Export MongoDB data to HDFS (using Sqoop or manual):

**Manual method** (easier):
```bash
# Export from MongoDB to JSON
mongosh mongodb://localhost:27017/recohub --quiet --eval "db.movies.find().toArray()" > ~/Desktop/RecoHub/datasets/exported_movies.json

# Upload to HDFS
hdfs dfs -put ~/Desktop/RecoHub/datasets/exported_movies.json /user/recohub/datasets/
```

### 2. Process with Spark:

```bash
cd ~/Desktop/RecoHub/spark
spark-submit --packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1 recommendations.py
```

### 3. Query with Hive:

```bash
hive -f ~/Desktop/RecoHub/hive/queries.hql
```

## 🎯 What You've Accomplished

✅ MongoDB - NoSQL database (DONE)
✅ Hadoop - Distributed file system
✅ Spark - Distributed processing
✅ Kafka - Real-time streaming
✅ Hive - SQL queries on big data
✅ Flume - Data ingestion
✅ Sqoop - Data transfer
✅ HBase - Fast lookups

All integrated into RecoHub!

