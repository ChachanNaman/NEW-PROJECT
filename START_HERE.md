# 🚀 START HERE - Complete Setup Guide

You've already done Step 1 ✅ (MongoDB with datasets). Now follow these steps:

## 📋 Your Current Status
- ✅ MongoDB installed and running
- ✅ Datasets uploaded (movies, songs, books) via MongoDB Compass
- ⏳ Need to install: Hadoop, Spark, Kafka, Hive, Flume, Sqoop, HBase

## 🎯 Step 2: Install Java First (Required!)

Open Terminal and run:

```bash
# Install Java 11
brew install openjdk@11

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@11' >> ~/.zshrc
source ~/.zshrc

# Verify
java -version
```

**Expected**: Should show Java 11.x

## 🎯 Step 3: Install All Big Data Tools

I've created detailed guides for you. Choose one:

### Option A: Complete Step-by-Step Guide
📄 **Read**: `STEP_BY_STEP_MAC.md`
- Simple, one command at a time
- Best for first-time setup

### Option B: Detailed Setup Guide  
📄 **Read**: `BIG_DATA_MAC_SETUP.md`
- More detailed explanations
- Includes troubleshooting

## 🔧 Quick Installation Commands (If You're Confident)

If you want to install everything quickly:

```bash
# Install all tools
brew install openjdk@11 hadoop apache-spark kafka hive flume sqoop hbase

# Set up Java
echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@11' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Configure Hadoop (use files in hadoop-config/)
# Copy config files (see STEP_BY_STEP_MAC.md Step 3)

# Create Hadoop directories
mkdir -p ~/hadoop-data/{namenode,datanode,tmp}

# Format HDFS (ONCE!)
HADOOP_HOME=$(brew --prefix hadoop)/libexec
$HADOOP_HOME/bin/hdfs namenode -format
```

## 📚 What Each Guide Contains

### `STEP_BY_STEP_MAC.md`
- ✅ Simple step-by-step commands
- ✅ One tool at a time
- ✅ Easy to follow
- ✅ Perfect for beginners

### `BIG_DATA_MAC_SETUP.md`  
- ✅ Detailed explanations
- ✅ Alternative methods (Docker)
- ✅ Troubleshooting tips
- ✅ Environment variable setup

### `QUICK_START.md`
- ✅ How to use everything after installation
- ✅ Export MongoDB data to HDFS
- ✅ Run Spark, Hive, Kafka
- ✅ Daily workflow

### `PROJECT_DOCUMENTATION.md`
- ✅ Complete project documentation template
- ✅ Problem statement
- ✅ Architecture diagrams
- ✅ Results and discussions
- ✅ Ready for your presentation!

## 🎓 For Your Course Requirements

You need to demonstrate:

1. **NoSQL (MongoDB)** ✅ DONE
   - Shows in Compass
   - Your datasets are there

2. **HDFS** - After Step 3
   - `hdfs dfs -ls /user/recohub/`
   - Shows files stored

3. **Apache Spark** - After Step 4
   - Run: `spark-submit spark/recommendations.py`
   - Shows distributed processing

4. **Kafka** - After Step 5
   - `kafka-topics --list`
   - Shows real-time streaming setup

5. **Hive/HiveQL** - After Step 6
   - Run: `hive -f hive/queries.hql`
   - Shows SQL on big data

6. **Flume** - After Step 7
   - `flume-ng agent -f flume/flume.conf`
   - Shows data ingestion

7. **Sqoop** - After Step 8
   - Run: `./sqoop/import.sh`
   - Shows data transfer

8. **HBase** - After Step 9
   - `hbase shell` → `list`
   - Shows fast lookups

## 🎬 Recommended Order

1. **First**: Read `STEP_BY_STEP_MAC.md` and follow it
2. **Then**: Read `QUICK_START.md` to use everything
3. **For Presentation**: Use `PROJECT_DOCUMENTATION.md`

## ⚠️ Important Notes

- Install Java FIRST (required for everything else)
- Format HDFS only ONCE (it deletes data!)
- Each tool takes 5-10 minutes to install
- Total setup time: ~1-2 hours
- You can install tools one by one, no need to do all at once

## 🆘 Need Help?

- Check `BIG_DATA_MAC_SETUP.md` for troubleshooting
- Each tool has verification commands in the guides
- If something fails, try the Docker alternative mentioned

## ✅ After Installation

Once everything is installed, you can:
1. Export your MongoDB data to HDFS
2. Process it with Spark
3. Query with Hive
4. Stream with Kafka
5. Show everything in your presentation!

Good luck! 🚀

