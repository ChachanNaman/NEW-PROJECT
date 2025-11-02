const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String
  },
  genres: [String],
  releaseYear: Number,
  duration: Number, // in minutes
  rating: {
    type: Number,
    default: 0
  },
  posterUrl: String,
  trailerUrl: String,
  director: String,
  cast: [String],
  language: String,
  contentRating: String, // G, PG, PG-13, R, etc.
  imdbId: String,
  tmdbId: String,
  averageRating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

movieSchema.index({ title: 'text', description: 'text', genres: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
