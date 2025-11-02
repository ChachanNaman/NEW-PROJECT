const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  author: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  genres: [String],
  isbn: String,
  isbn13: String,
  pages: Number,
  publishYear: Number,
  publisher: String,
  coverUrl: String,
  averageRating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  goodreadsId: String
}, {
  timestamps: true
});

bookSchema.index({ title: 'text', author: 'text', description: 'text', genres: 'text' });

module.exports = mongoose.model('Book', bookSchema);
