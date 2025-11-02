"""
Simple Spark Script to Process RecoHub Datasets
Demonstrates big data processing on MongoDB data
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, avg, max as spark_max, min as spark_min
import pymongo
import json

def create_spark_session():
    """Create Spark session"""
    spark = SparkSession.builder \
        .appName("RecoHubDataProcessing") \
        .config("spark.master", "local[*]") \
        .getOrCreate()
    return spark

def load_data_from_mongodb():
    """Load data from MongoDB using pymongo (simpler than Spark connector)"""
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client.recohub
    
    # Load collections
    movies = list(db.movies.find({}, {"_id": 0}))
    songs = list(db.songs.find({}, {"_id": 0}))
    books = list(db.books.find({}, {"_id": 0}))
    ratings = list(db.ratings.find({}, {"_id": 0}))
    
    # Convert ObjectId to string for JSON serialization
    def convert_ids(docs):
        for doc in docs:
            if 'userId' in doc:
                doc['userId'] = str(doc['userId'])
            if 'contentId' in doc:
                doc['contentId'] = str(doc['contentId'])
        return docs
    
    ratings = convert_ids(ratings)
    
    return movies, songs, books, ratings

def process_with_spark(spark, movies, songs, books, ratings):
    """Process data using Spark"""
    print("\n" + "="*50)
    print("Processing Data with Apache Spark")
    print("="*50 + "\n")
    
    # Create DataFrames from Python lists
    if movies:
        movies_df = spark.createDataFrame(movies)
        print("📽️  MOVIES ANALYSIS")
        print("-" * 50)
        print(f"Total Movies: {movies_df.count()}")
        
        if movies_df.count() > 0:
            print("\nAverage Rating by Genre:")
            # Flatten genres and calculate average rating
            movies_df.select("genres", "averageRating").show(truncate=False)
            
            print("\nTop Rated Movies:")
            movies_df.orderBy(col("averageRating").desc()).select("title", "averageRating", "ratingCount").show(5)
    
    if songs:
        songs_df = spark.createDataFrame(songs)
        print("\n🎵 SONGS ANALYSIS")
        print("-" * 50)
        print(f"Total Songs: {songs_df.count()}")
        
        if songs_df.count() > 0:
            print("\nTop Popular Songs:")
            songs_df.orderBy(col("popularity").desc()).select("title", "artist", "popularity").show(5)
    
    if books:
        books_df = spark.createDataFrame(books)
        print("\n📚 BOOKS ANALYSIS")
        print("-" * 50)
        print(f"Total Books: {books_df.count()}")
        
        if books_df.count() > 0:
            print("\nTop Rated Books:")
            books_df.orderBy(col("averageRating").desc()).select("title", "author", "averageRating").show(5)
    
    if ratings:
        ratings_df = spark.createDataFrame(ratings)
        print("\n⭐ RATINGS ANALYSIS")
        print("-" * 50)
        print(f"Total Ratings: {ratings_df.count()}")
        
        if ratings_df.count() > 0:
            print("\nRating Distribution:")
            ratings_df.groupBy("rating").agg(count("*").alias("count")).orderBy("rating").show()
            
            print("\nAverage Rating by Content Type:")
            ratings_df.groupBy("contentType").agg(avg("rating").alias("avg_rating")).show()
    
    print("\n" + "="*50)
    print("✅ Spark Processing Complete!")
    print("="*50 + "\n")

def main():
    """Main execution"""
    print("🚀 Starting RecoHub Big Data Processing")
    
    # Create Spark session
    spark = create_spark_session()
    
    try:
        # Load data from MongoDB
        print("📥 Loading data from MongoDB...")
        movies, songs, books, ratings = load_data_from_mongodb()
        
        print(f"Loaded: {len(movies)} movies, {len(songs)} songs, {len(books)} books, {len(ratings)} ratings")
        
        # Process with Spark
        process_with_spark(spark, movies, songs, books, ratings)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        spark.stop()
        print("Spark session closed.")

if __name__ == "__main__":
    main()

