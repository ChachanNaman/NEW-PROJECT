const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  artist: {
    type: String,
    required: true,
    index: true
  },
  album: String,
  genres: [String],
  duration: Number, // in seconds
  releaseYear: Number,
  spotifyId: String,
  previewUrl: String,
  imageUrl: String,
  popularity: {
    type: Number,
    default: 0
  },
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

songSchema.index({ title: 'text', artist: 'text', album: 'text', genres: 'text' });

module.exports = mongoose.model('Song', songSchema);
