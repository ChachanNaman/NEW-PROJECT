const express = require('express');
const Rating = require('../models/Rating');
const Movie = require('../models/Movie');
const Song = require('../models/Song');
const Book = require('../models/Book');
const Series = require('../models/Series');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to update content average rating
async function updateContentRating(contentType, contentId) {
  const ratings = await Rating.find({ contentType, contentId });
  if (ratings.length === 0) return;

  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  
  const updateData = {
    averageRating: Math.round(averageRating * 10) / 10,
    ratingCount: ratings.length
  };

  switch (contentType) {
    case 'movie':
      await Movie.findByIdAndUpdate(contentId, updateData);
      break;
    case 'song':
      await Song.findByIdAndUpdate(contentId, updateData);
      break;
    case 'book':
      await Book.findByIdAndUpdate(contentId, updateData);
      break;
    case 'series':
      await Series.findByIdAndUpdate(contentId, updateData);
      break;
  }
}

// Create or update rating
router.post('/', auth, async (req, res) => {
  try {
    const { contentType, contentId, rating, review } = req.body;

    if (!['movie', 'song', 'book', 'series'].includes(contentType)) {
      return res.status(400).json({ message: 'Invalid content type' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if rating exists
    let userRating = await Rating.findOne({
      userId: req.user._id,
      contentType,
      contentId
    });

    if (userRating) {
      // Update existing rating
      userRating.rating = rating;
      userRating.review = review || userRating.review;
      userRating.updatedAt = new Date();
      await userRating.save();
    } else {
      // Create new rating
      userRating = new Rating({
        userId: req.user._id,
        contentType,
        contentId,
        rating,
        review
      });
      await userRating.save();
    }

    // Update content average rating
    await updateContentRating(contentType, contentId);

    res.json(userRating);
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's ratings
router.get('/user', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rating for specific content
router.get('/:contentType/:contentId', auth, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const rating = await Rating.findOne({
      userId: req.user._id,
      contentType,
      contentId
    });
    res.json(rating || { rating: null });
  } catch (error) {
    console.error('Get rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete rating
router.delete('/:contentType/:contentId', auth, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    await Rating.findOneAndDelete({
      userId: req.user._id,
      contentType,
      contentId
    });

    // Update content average rating
    await updateContentRating(contentType, contentId);

    res.json({ message: 'Rating deleted' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
