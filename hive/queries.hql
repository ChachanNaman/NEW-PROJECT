-- HiveQL queries for analytics on HDFS data
-- Create external tables pointing to HDFS locations

-- Create database
CREATE DATABASE IF NOT EXISTS recohub;
USE recohub;

-- Create external table for movies stored in HDFS
CREATE EXTERNAL TABLE IF NOT EXISTS movies (
    _id STRING,
    title STRING,
    description STRING,
    genres ARRAY<STRING>,
    releaseYear INT,
    duration INT,
    director STRING,
    averageRating DOUBLE,
    ratingCount INT
)
STORED AS PARQUET
LOCATION 'hdfs://localhost:9000/user/recohub/mongodb/movies';

-- Create external table for ratings stored in HDFS
CREATE EXTERNAL TABLE IF NOT EXISTS ratings (
    _id STRING,
    userId STRING,
    contentType STRING,
    contentId STRING,
    rating INT,
    createdAt TIMESTAMP
)
STORED AS PARQUET
LOCATION 'hdfs://localhost:9000/user/recohub/mongodb/ratings';

-- Create external table for songs
CREATE EXTERNAL TABLE IF NOT EXISTS songs (
    _id STRING,
    title STRING,
    artist STRING,
    album STRING,
    genres ARRAY<STRING>,
    duration INT,
    popularity INT,
    averageRating DOUBLE
)
STORED AS PARQUET
LOCATION 'hdfs://localhost:9000/user/recohub/mongodb/songs';

-- Analytics Queries

-- 1. Top 10 most rated movies
SELECT 
    m.title,
    m.averageRating,
    m.ratingCount
FROM movies m
ORDER BY m.ratingCount DESC
LIMIT 10;

-- 2. Average rating by genre
SELECT 
    genre,
    AVG(averageRating) as avgRating,
    COUNT(*) as count
FROM movies
LATERAL VIEW explode(genres) g AS genre
GROUP BY genre
ORDER BY avgRating DESC;

-- 3. User rating distribution
SELECT 
    rating,
    COUNT(*) as count
FROM ratings
GROUP BY rating
ORDER BY rating;

-- 4. Most active users (by rating count)
SELECT 
    userId,
    COUNT(*) as ratingCount,
    AVG(rating) as avgRating
FROM ratings
GROUP BY userId
ORDER BY ratingCount DESC
LIMIT 20;

-- 5. Content type popularity
SELECT 
    contentType,
    COUNT(*) as totalRatings,
    AVG(rating) as avgRating
FROM ratings
GROUP BY contentType;

-- 6. Year-wise movie releases
SELECT 
    releaseYear,
    COUNT(*) as movieCount
FROM movies
WHERE releaseYear IS NOT NULL
GROUP BY releaseYear
ORDER BY releaseYear DESC;

-- 7. Artist popularity (from songs)
SELECT 
    artist,
    COUNT(*) as songCount,
    AVG(popularity) as avgPopularity
FROM songs
GROUP BY artist
ORDER BY avgPopularity DESC
LIMIT 20;

