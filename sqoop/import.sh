#!/bin/bash

# Sqoop scripts for importing/exporting data between MongoDB and HDFS

echo "Starting Sqoop import operations..."

# Import movies from MongoDB to HDFS
echo "Importing movies from MongoDB to HDFS..."
sqoop import \
  --connect "mongodb://localhost:27017/recohub" \
  --collection movies \
  --m 4 \
  --target-dir /user/recohub/mongodb/movies \
  --fields-terminated-by ',' \
  --lines-terminated-by '\n'

# Import ratings from MongoDB to HDFS
echo "Importing ratings from MongoDB to HDFS..."
sqoop import \
  --connect "mongodb://localhost:27017/recohub" \
  --collection ratings \
  --m 4 \
  --target-dir /user/recohub/mongodb/ratings \
  --fields-terminated-by ',' \
  --lines-terminated-by '\n'

# Import songs from MongoDB to HDFS
echo "Importing songs from MongoDB to HDFS..."
sqoop import \
  --connect "mongodb://localhost:27017/recohub" \
  --collection songs \
  --m 4 \
  --target-dir /user/recohub/mongodb/songs \
  --fields-terminated-by ',' \
  --lines-terminated-by '\n'

# Import books from MongoDB to HDFS
echo "Importing books from MongoDB to HDFS..."
sqoop import \
  --connect "mongodb://localhost:27017/recohub" \
  --collection books \
  --m 4 \
  --target-dir /user/recohub/mongodb/books \
  --fields-terminated-by ',' \
  --lines-terminated-by '\n'

echo "Sqoop import operations completed!"

# Export processed recommendations from HDFS back to MongoDB
# echo "Exporting recommendations from HDFS to MongoDB..."
# sqoop export \
#   --connect "mongodb://localhost:27017/recohub" \
#   --collection recommendations \
#   --export-dir /user/recohub/spark/recommendations \
#   --m 4 \
#   --input-fields-terminated-by ','

