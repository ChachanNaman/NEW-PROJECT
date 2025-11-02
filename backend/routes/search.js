const express = require('express');
const Movie = require('../models/Movie');
const Song = require('../models/Song');
const Book = require('../models/Book');
const Series = require('../models/Series');

const router = express.Router();

// Global search across all content types
router.get('/', async (req, res) => {
  try {
    const { q, type, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchLimit = parseInt(limit);
    const results = {
      movies: [],
      songs: [],
      books: [],
      series: []
    };

    const searchQuery = { $text: { $search: q } };

    if (!type || type === 'movie') {
      results.movies = await Movie.find(searchQuery).limit(searchLimit);
    }
    if (!type || type === 'song') {
      results.songs = await Song.find(searchQuery).limit(searchLimit);
    }
    if (!type || type === 'book') {
      results.books = await Book.find(searchQuery).limit(searchLimit);
    }
    if (!type || type === 'series') {
      results.series = await Series.find(searchQuery).limit(searchLimit);
    }

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
