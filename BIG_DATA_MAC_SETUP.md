# Big Data Setup Guide for macOS

Since you've already uploaded datasets to MongoDB, let's install and configure all big data technologies step by step.

## Prerequisites

1. **Install Homebrew** (if not installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **Verify MongoDB is running**:
```bash
mongosh mongodb://localhost:27017/recohub
# Should connect successfully
exit
```

## Step-by-Step Installation

### Step 1: Install Java (Required for Hadoop, Spark, Kafka, etc.)

```bash
# Install Java 11 (required for most big data tools)
brew install openjdk@11

# Add to PATH (add this to ~/.zshrc)
echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@11' >> ~/.zshrc
source ~/.zshrc

# Verify Java installation
java -version
```

### Step 2: Install and Configure Hadoop

```bash
# Install Hadoop
brew install hadoop

# Find Hadoop installation path
export HADOOP_HOME=$(brew --prefix hadoop)/libexec

# Create Hadoop directories
mkdir -p ~/hadoop-data/namenode
mkdir -p ~/hadoop-data/datanode
mkdir -p ~/hadoop-data/tmp

# Copy configuration files (we created them in hadoop-config/)
cp hadoop-config/core-site.xml $HADOOP_HOME/etc/hadoop/
cp hadoop-config/hdfs-site.xml $HADOOP_HOME/etc/hadoop/
cp hadoop-config/mapred-site.xml $HADOOP_HOME/etc/hadoop/
cp hadoop-config/yarn-site.xml $HADOOP_HOME/etc/hadoop/

# Format HDFS (ONLY ONCE - will delete all data!)
$HADOOP_HOME/bin/hdfs namenode -format

# Start HDFS
$HADOOP_HOME/sbin/start-dfs.sh

# Verify HDFS is running
jps
# Should show: NameNode, DataNode, SecondaryNameNode

# Test HDFS
$HADOOP_HOME/bin/hdfs dfs -ls /
$HADOOP_HOME/bin/hdfs dfs -mkdir -p /user/recohub/datasets
```

**Alternative (Easier)**: Use Docker for Hadoop
```bash
# Install Docker Desktop for Mac
# Download from: https://www.docker.com/products/docker-desktop

# Run Hadoop in Docker
docker run -d -p 9870:9870 -p 9864:9864 -p 9000:9000 --name hadoop bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8
```

### Step 3: Install Apache Spark

```bash
# Install Spark
brew install apache-spark

# Verify installation
spark-shell --version

# Test Spark
spark-shell
# Type: println("Spark is working!")
# Exit: :quit
```

**Configure Spark for MongoDB**:
```bash
# Download MongoDB Spark Connector
cd ~/Desktop/RecoHub/spark
curl -O https://repo1.maven.org/maven2/org/mongodb/spark/mongo-spark-connector_2.12/3.0.1/mongo-spark-connector_2.12-3.0.1.jar

# Test Spark with MongoDB
spark-shell --packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1
```

### Step 4: Install Apache Kafka

```bash
# Install Kafka
brew install kafka

# Start Zookeeper (required for Kafka)
zookeeper-server-start /opt/homebrew/etc/kafka/zookeeper.properties &
# Or: brew services start zookeeper

# Start Kafka
kafka-server-start /opt/homebrew/etc/kafka/server.properties &
# Or: brew services start kafka

# Wait a few seconds, then verify
kafka-topics --list --bootstrap-server localhost:9092

# Create topics for RecoHub
kafka-topics --create --bootstrap-server localhost:9092 \
  --replication-factor 1 --partitions 1 --topic user-ratings

kafka-topics --create --bootstrap-server localhost:9092 \
  --replication-factor 1 --partitions 1 --topic user-activities

# List topics to verify
kafka-topics --list --bootstrap-server localhost:9092
```

### Step 5: Install Apache Flume

```bash
# Install Flume
brew install flume

# Verify installation
flume-ng version

# Configure Flume (use the flume.conf we created)
# Edit flume/flume.conf and update paths
# Then start Flume agent
flume-ng agent -n agent -f ~/Desktop/RecoHub/flume/flume.conf -Dflume.root.logger=INFO,console
```

### Step 6: Install Hive

```bash
# Install Hive
brew install hive

# Initialize Hive schema (Derby database - for local development)
schematool -initSchema -dbType derby

# Start Hive
hive

# Test Hive
# In Hive shell, type:
SHOW DATABASES;
CREATE DATABASE recohub;
USE recohub;
EXIT;
```

### Step 7: Install Sqoop

```bash
# Install Sqoop
brew install sqoop

# Download MongoDB connector
cd ~/Desktop/RecoHub/sqoop
curl -O https://github.com/mongodb/mongo-hadoop/releases/download/r2.0.2/mongo-hadoop-core-2.0.2.jar
curl -O https://github.com/mongodb/mongo-hadoop/releases/download/r2.0.2/mongo-hadoop-2.0.2.jar

# Configure Sqoop (add jars to SQOOP_CLASSPATH)
export SQOOP_HOME=$(brew --prefix sqoop)/libexec
export SQOOP_CLASSPATH=$SQOOP_HOME/lib/mongo-hadoop-core-2.0.2.jar:$SQOOP_HOME/lib/mongo-hadoop-2.0.2.jar
```

### Step 8: Install HBase

```bash
# Install HBase
brew install hbase

# Start HBase
start-hbase.sh

# Start HBase shell
hbase shell

# In HBase shell:
# create 'trending_items', 'movies', 'songs', 'books', 'series'
# list
# exit
```

## Quick Verification Script

Create a script to verify all installations:

```bash
cat > ~/Desktop/RecoHub/verify-installations.sh << 'EOF'
#!/bin/bash

echo "=== Verifying Big Data Installations ==="

echo "1. Java:"
java -version 2>&1 | head -1

echo "2. Hadoop:"
$HADOOP_HOME/bin/hadoop version 2>&1 | head -1

echo "3. Spark:"
spark-shell --version 2>&1 | head -1

echo "4. Kafka:"
kafka-topics --list --bootstrap-server localhost:9092 2>&1

echo "5. Flume:"
flume-ng version 2>&1 | head -1

echo "6. Hive:"
hive --version 2>&1 | head -1

echo "7. Sqoop:"
sqoop version 2>&1 | head -1

echo "8. HBase:"
hbase version 2>&1 | head -1

echo "9. MongoDB:"
mongosh --version 2>&1 | head -1

echo "=== Verification Complete ==="
EOF

chmod +x ~/Desktop/RecoHub/verify-installations.sh
```

## Environment Variables Setup

Add these to your `~/.zshrc`:

```bash
# Big Data Environment Variables
export JAVA_HOME=/opt/homebrew/opt/openjdk@11
export HADOOP_HOME=$(brew --prefix hadoop)/libexec
export SPARK_HOME=$(brew --prefix apache-spark)/libexec
export KAFKA_HOME=$(brew --prefix kafka)
export FLUME_HOME=$(brew --prefix flume)/libexec
export HIVE_HOME=$(brew --prefix hive)/libexec
export SQOOP_HOME=$(brew --prefix sqoop)/libexec
export HBASE_HOME=$(brew --prefix hbase)/libexec

export PATH=$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$SPARK_HOME/bin:$KAFKA_HOME/bin:$FLUME_HOME/bin:$HIVE_HOME/bin:$SQOOP_HOME/bin:$HBASE_HOME/bin:$PATH

# Hadoop specific
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
```

Then reload:
```bash
source ~/.zshrc
```

## Starting All Services

Create a startup script:

```bash
cat > ~/Desktop/RecoHub/start-bigdata-services.sh << 'EOF'
#!/bin/bash

echo "Starting Big Data Services..."

# 1. Start HDFS
echo "Starting HDFS..."
$HADOOP_HOME/sbin/start-dfs.sh
sleep 5

# 2. Start YARN
echo "Starting YARN..."
$HADOOP_HOME/sbin/start-yarn.sh
sleep 3

# 3. Start Zookeeper
echo "Starting Zookeeper..."
zookeeper-server-start $KAFKA_HOME/config/zookeeper.properties > /tmp/zookeeper.log 2>&1 &
sleep 5

# 4. Start Kafka
echo "Starting Kafka..."
kafka-server-start $KAFKA_HOME/config/server.properties > /tmp/kafka.log 2>&1 &
sleep 5

# 5. Start HBase
echo "Starting HBase..."
start-hbase.sh
sleep 5

echo "All services started!"
echo "Check status with: jps"
EOF

chmod +x ~/Desktop/RecoHub/start-bigdata-services.sh
```

## Next Steps After Installation

1. **Import data from MongoDB to HDFS** (Sqoop):
```bash
cd ~/Desktop/RecoHub/sqoop
./import.sh
```

2. **Upload unstructured files to HDFS**:
```bash
hdfs dfs -put datasets/unstructured/images /user/recohub/unstructured/images
hdfs dfs -put datasets/unstructured/videos /user/recohub/unstructured/videos
hdfs dfs -put datasets/unstructured/pdfs /user/recohub/unstructured/pdfs
```

3. **Run Spark recommendations**:
```bash
cd ~/Desktop/RecoHub/spark
spark-submit --packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1 recommendations.py
```

4. **Query with Hive**:
```bash
hive -f hive/queries.hql
```

## Troubleshooting

### If Hadoop installation fails:
- Use Docker alternative (see Step 2)
- Or use standalone mode (simpler, no HDFS)

### If Kafka won't start:
- Check if port 9092 is already in use
- Kill existing Kafka processes: `pkill -f kafka`

### If Spark can't find MongoDB:
- Download the connector jar manually
- Use `--jars` instead of `--packages`

### Memory Issues:
- Reduce heap size in configurations
- Close other applications
