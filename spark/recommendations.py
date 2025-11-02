"""
Apache Spark Recommendation System
Processes large-scale ratings data for collaborative filtering
"""

from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALS
from pyspark.ml.feature import StringIndexer
from pyspark.sql.functions import col, explode
import pymongo

def create_spark_session():
    """Create Spark session with MongoDB connector"""
    spark = SparkSession.builder \
        .appName("RecoHubRecommendations") \
        .config("spark.mongodb.input.uri", "mongodb://localhost:27017/recohub.ratings") \
        .config("spark.mongodb.output.uri", "mongodb://localhost:27017/recohub.recommendations") \
        .config("spark.jars.packages", "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1") \
        .getOrCreate()
    return spark

def load_ratings_from_mongodb(spark):
    """Load ratings from MongoDB"""
    ratings = spark.read.format("mongo").load()
    
    # Convert ObjectId to string for indexing
    ratings = ratings.withColumn("userId_str", col("userId").cast("string")) \
                    .withColumn("contentId_str", col("contentId").cast("string"))
    
    return ratings

def prepare_ratings_for_als(ratings_df):
    """Prepare ratings for ALS algorithm"""
    # Index userId and contentId
    user_indexer = StringIndexer(inputCol="userId_str", outputCol="userId_indexed")
    content_indexer = StringIndexer(inputCol="contentId_str", outputCol="contentId_indexed")
    
    indexed = user_indexer.fit(ratings_df).transform(ratings_df)
    indexed = content_indexer.fit(indexed).transform(indexed)
    
    # Select required columns for ALS
    als_data = indexed.select(
        col("userId_indexed").alias("userId"),
        col("contentId_indexed").alias("itemId"),
        col("rating").alias("rating")
    )
    
    return als_data, user_indexer, content_indexer

def train_als_model(ratings_df):
    """Train ALS collaborative filtering model"""
    als = ALS(
        maxIter=10,
        regParam=0.01,
        userCol="userId",
        itemCol="itemId",
        ratingCol="rating",
        coldStartStrategy="drop",
        implicitPrefs=False
    )
    
    model = als.fit(ratings_df)
    return model

def generate_recommendations(model, num_recommendations=10):
    """Generate recommendations for all users"""
    recommendations = model.recommendForAllUsers(num_recommendations)
    return recommendations

def save_recommendations_to_mongodb(spark, recommendations_df):
    """Save recommendations to MongoDB"""
    recommendations_df.write \
        .format("mongo") \
        .mode("overwrite") \
        .option("database", "recohub") \
        .option("collection", "recommendations") \
        .save()
    print("Recommendations saved to MongoDB")

def main():
    """Main execution function"""
    print("Initializing Spark session...")
    spark = create_spark_session()
    
    print("Loading ratings from MongoDB...")
    ratings = load_ratings_from_mongodb(spark)
    print(f"Loaded {ratings.count()} ratings")
    
    print("Preparing data for ALS...")
    als_data, user_indexer, content_indexer = prepare_ratings_for_als(ratings)
    
    print("Training ALS model...")
    model = train_als_model(als_data)
    
    print("Generating recommendations...")
    recommendations = generate_recommendations(model, num_recommendations=10)
    
    print("Saving recommendations to MongoDB...")
    save_recommendations_to_mongodb(spark, recommendations)
    
    print("Processing complete!")
    spark.stop()

if __name__ == "__main__":
    main()

