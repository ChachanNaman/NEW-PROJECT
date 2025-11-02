const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config();

// Import models
const Movie = require('../models/Movie');
const Song = require('../models/Song');
const Book = require('../models/Book');
const Series = require('../models/Series');

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

// Import JSON dataset
async function importJSONDataset(filePath, contentType) {
  try {
    console.log(`Reading file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    let items = Array.isArray(data) ? data : [data];
    let imported = 0;
    let skipped = 0;

    const Model = {
      movies: Movie,
      songs: Song,
      books: Book,
      series: Series
    }[contentType];

    if (!Model) {
      console.error(`Invalid content type: ${contentType}`);
      return;
    }

    console.log(`Importing ${items.length} items...`);

    for (const item of items) {
      try {
        // Check if item already exists (by title or id)
        const existing = await Model.findOne({
          $or: [
            { title: item.title },
            { imdbId: item.imdbId },
            { tmdbId: item.tmdbId },
            { spotifyId: item.spotifyId },
            { goodreadsId: item.goodreadsId }
          ]
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Map common fields
        const mappedItem = {
          title: item.title || item.name || item.movie_title || item.Title,
          description: item.description || item.overview || item.plot || item.summary,
          genres: Array.isArray(item.genres) ? item.genres : 
                 (item.genre ? [item.genre] : []),
          releaseYear: item.releaseYear || item.year || item.release_date?.substring(0, 4) || 
                      item.publish_year || item.published_year,
          ...item
        };

        // Content-specific mappings
        if (contentType === 'movies') {
          mappedItem.director = item.director || item.Director;
          mappedItem.cast = Array.isArray(item.cast) ? item.cast : 
                           (item.Cast ? item.Cast.split(',').map(s => s.trim()) : []);
          mappedItem.duration = item.duration || item.runtime || item.Runtime;
          mappedItem.imdbId = item.imdbId || item.imdb_id;
        }

        if (contentType === 'songs') {
          mappedItem.artist = item.artist || item.Artist || item.artists?.[0];
          mappedItem.album = item.album || item.Album;
          mappedItem.duration = item.duration || item.Duration_ms ? item.Duration_ms / 1000 : null;
          mappedItem.spotifyId = item.spotifyId || item.id;
        }

        if (contentType === 'books') {
          mappedItem.author = item.author || item.Author;
          mappedItem.isbn = item.isbn || item.ISBN;
          mappedItem.pages = item.pages || item.num_pages;
          mappedItem.goodreadsId = item.goodreadsId || item.book_id;
        }

        if (contentType === 'series') {
          mappedItem.creators = Array.isArray(item.creators) ? item.creators : [];
          mappedItem.cast = Array.isArray(item.cast) ? item.cast : [];
          mappedItem.seasons = item.seasons || item.number_of_seasons;
          mappedItem.episodes = item.episodes || item.number_of_episodes;
        }

        await Model.create(mappedItem);
        imported++;

        if (imported % 100 === 0) {
          console.log(`Imported ${imported} items...`);
        }
      } catch (error) {
        console.error(`Error importing item:`, error.message);
        skipped++;
      }
    }

    console.log(`\nImport complete!`);
    console.log(`Imported: ${imported}`);
    console.log(`Skipped: ${skipped}`);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

// Import CSV dataset
async function importCSVDataset(filePath, contentType) {
  try {
    console.log(`Reading CSV file: ${filePath}`);
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const Model = {
      movies: Movie,
      songs: Song,
      books: Book,
      series: Series
    }[contentType];

    if (!Model) {
      console.error(`Invalid content type: ${contentType}`);
      return;
    }

    let headers = [];
    let imported = 0;
    let skipped = 0;
    let lineNumber = 0;

    for await (const line of rl) {
      lineNumber++;
      
      if (lineNumber === 1) {
        headers = line.split(',').map(h => h.trim());
        continue;
      }

      const values = line.split(',');
      const item = {};
      
      headers.forEach((header, index) => {
        item[header] = values[index]?.trim() || '';
      });

      try {
        // Check if exists
        const existing = await Model.findOne({ title: item.title || item.name });
        if (existing) {
          skipped++;
          continue;
        }

        // Map and create
        const mappedItem = mapCSVItem(item, contentType);
        await Model.create(mappedItem);
        imported++;

        if (imported % 100 === 0) {
          console.log(`Imported ${imported} items...`);
        }
      } catch (error) {
        skipped++;
      }
    }

    console.log(`\nImport complete!`);
    console.log(`Imported: ${imported}`);
    console.log(`Skipped: ${skipped}`);
  } catch (error) {
    console.error('Error reading CSV:', error);
  }
}

function mapCSVItem(item, contentType) {
  const mapped = {
    title: item.title || item.name || item.movie_title || item.Title,
    description: item.description || item.overview || item.plot,
    genres: item.genres ? item.genres.split('|').filter(g => g) : [],
    releaseYear: item.year || item.release_year ? parseInt(item.year || item.release_year) : null,
  };

  if (contentType === 'movies') {
    mapped.director = item.director || item.Director;
    mapped.cast = item.cast ? item.cast.split('|') : [];
    mapped.duration = item.duration ? parseInt(item.duration) : null;
  }

  if (contentType === 'songs') {
    mapped.artist = item.artist || item.Artist;
    mapped.album = item.album || item.Album;
    mapped.duration = item.duration ? parseInt(item.duration) : null;
  }

  if (contentType === 'books') {
    mapped.author = item.author || item.Author;
    mapped.isbn = item.isbn || item.ISBN;
    mapped.pages = item.pages ? parseInt(item.pages) : null;
  }

  return mapped;
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node importDataset.js <file-path> <content-type>');
    console.log('Content types: movies, songs, books, series');
    console.log('Supported formats: JSON, CSV');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  const contentType = args[1];

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.json') {
    await importJSONDataset(filePath, contentType);
  } else if (ext === '.csv') {
    await importCSVDataset(filePath, contentType);
  } else {
    console.error(`Unsupported file format: ${ext}`);
    process.exit(1);
  }

  await mongoose.connection.close();
  process.exit(0);
}

main();
