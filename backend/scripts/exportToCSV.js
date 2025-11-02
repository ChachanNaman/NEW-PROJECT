const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const Movie = require('../models/Movie');
const Song = require('../models/Song');
const Book = require('../models/Book');
const Series = require('../models/Series');
const Rating = require('../models/Rating');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recohub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Convert array to CSV row
function arrayToCSVRow(items) {
  return items ? items.join('; ') : '';
}

// Convert document to CSV row
function docToCSVRow(doc, fields) {
  return fields.map(field => {
    let value = doc[field];
    if (Array.isArray(value)) {
      value = value.join('; ');
    }
    if (value === null || value === undefined) {
      value = '';
    }
    // Escape commas and quotes
    value = String(value).replace(/"/g, '""');
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      value = `"${value}"`;
    }
    return value;
  }).join(',');
}

// Export collection to CSV
async function exportToCSV(Model, filename, fields) {
  try {
    console.log(`Exporting ${filename}...`);
    
    const docs = await Model.find({});
    console.log(`Found ${docs.length} documents`);

    if (docs.length === 0) {
      console.log(`No data to export for ${filename}`);
      return;
    }

    // Create CSV header
    const header = fields.join(',');
    const rows = [header];

    // Add data rows
    for (const doc of docs) {
      const row = docToCSVRow(doc, fields);
      rows.push(row);
    }

    // Write to file
    const exportDir = path.join(__dirname, '../../datasets/exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const filePath = path.join(exportDir, filename);
    fs.writeFileSync(filePath, rows.join('\n'), 'utf8');
    
    console.log(`✅ Exported ${docs.length} records to ${filePath}`);
  } catch (error) {
    console.error(`Error exporting ${filename}:`, error);
  }
}

// Main export function
async function main() {
  try {
    console.log('Starting CSV export for Power BI...\n');

    // Export Movies
    await exportToCSV(Movie, 'movies.csv', [
      '_id',
      'title',
      'description',
      'genres',
      'releaseYear',
      'duration',
      'director',
      'cast',
      'language',
      'contentRating',
      'averageRating',
      'ratingCount',
      'createdAt'
    ]);

    // Export Songs
    await exportToCSV(Song, 'songs.csv', [
      '_id',
      'title',
      'artist',
      'album',
      'genres',
      'duration',
      'releaseYear',
      'popularity',
      'averageRating',
      'ratingCount',
      'createdAt'
    ]);

    // Export Books
    await exportToCSV(Book, 'books.csv', [
      '_id',
      'title',
      'author',
      'description',
      'genres',
      'isbn',
      'pages',
      'publishYear',
      'publisher',
      'averageRating',
      'ratingCount',
      'createdAt'
    ]);

    // Export Series
    await exportToCSV(Series, 'series.csv', [
      '_id',
      'title',
      'description',
      'genres',
      'releaseYear',
      'endYear',
      'seasons',
      'episodes',
      'creators',
      'cast',
      'language',
      'contentRating',
      'averageRating',
      'ratingCount',
      'createdAt'
    ]);

    // Export Ratings
    await exportToCSV(Rating, 'ratings.csv', [
      '_id',
      'userId',
      'contentType',
      'contentId',
      'rating',
      'review',
      'createdAt',
      'updatedAt'
    ]);

    // Create summary file
    const summary = {
      exportDate: new Date().toISOString(),
      movies: await Movie.countDocuments(),
      songs: await Song.countDocuments(),
      books: await Book.countDocuments(),
      series: await Series.countDocuments(),
      ratings: await Rating.countDocuments(),
    };

    const summaryPath = path.join(__dirname, '../../datasets/exports/export_summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log('\n✅ Export Summary:');
    console.log(`   Movies: ${summary.movies}`);
    console.log(`   Songs: ${summary.songs}`);
    console.log(`   Books: ${summary.books}`);
    console.log(`   Series: ${summary.series}`);
    console.log(`   Ratings: ${summary.ratings}`);
    console.log(`\n📁 All files exported to: datasets/exports/`);
    console.log('   Ready for Power BI import! 🎉');

  } catch (error) {
    console.error('Export error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

main();

