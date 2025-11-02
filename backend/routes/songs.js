const express = require('express');
const Song = require('../models/Song');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all songs with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      genre, 
      artist,
      search,
      sortBy = 'popularity',
      order = 'desc'
    } = req.query;

    const query = {};
    if (genre) query.genres = { $in: [genre] };
    if (artist) query.artist = { $regex: artist, $options: 'i' };
    if (search) {
      query.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const songs = await Song.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Song.countDocuments(query);

    res.json({
      songs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get songs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single song
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    console.error('Get song error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get genres
router.get('/meta/genres', async (req, res) => {
  try {
    const genres = await Song.distinct('genres');
    res.json(genres.filter(g => g).sort());
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
