const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recohub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/books', require('./routes/books'));
app.use('/api/series', require('./routes/series'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/search', require('./routes/search'));
app.use('/api/powerbi', require('./routes/powerbi'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RecoHub API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
