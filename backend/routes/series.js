const express = require('express');
const Series = require('../models/Series');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all series with pagination and filtering
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

    const series = await Series.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Series.countDocuments(query);

    res.json({
      series,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get series error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single series
router.get('/:id', async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json({ message: 'Series not found' });
    }
    res.json(series);
  } catch (error) {
    console.error('Get series error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get genres
router.get('/meta/genres', async (req, res) => {
  try {
    const genres = await Series.distinct('genres');
    res.json(genres.filter(g => g).sort());
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
