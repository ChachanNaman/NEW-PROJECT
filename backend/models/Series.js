const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  genres: [String],
  releaseYear: Number,
  endYear: Number,
  seasons: Number,
  episodes: Number,
  rating: {
    type: Number,
    default: 0
  },
  posterUrl: String,
  trailerUrl: String,
  creators: [String],
  cast: [String],
  language: String,
  contentRating: String,
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

seriesSchema.index({ title: 'text', description: 'text', genres: 'text' });

module.exports = mongoose.model('Series', seriesSchema);
