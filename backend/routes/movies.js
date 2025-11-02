const express = require('express');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all movies with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      genre, 
      year, 
      search,
      sortBy = 'averageRating',
      order = 'desc'
    } = req.query;

    const query = {};
    if (genre) query.genres = { $in: [genre] };
    if (year) query.releaseYear = parseInt(year);
    if (search) {
      query.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const movies = await Movie.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get genres
router.get('/meta/genres', async (req, res) => {
  try {
    const genres = await Movie.distinct('genres');
    res.json(genres.filter(g => g).sort());
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
