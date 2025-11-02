const mongoose = require('mongoose');
require('dotenv').config();

const Movie = require('../models/Movie');
const Song = require('../models/Song');
const Book = require('../models/Book');
const Series = require('../models/Series');

// Sample data
const sampleMovies = [
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    genres: ['Drama'],
    releaseYear: 1994,
    duration: 142,
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    language: 'English',
    contentRating: 'R',
    averageRating: 4.8,
    ratingCount: 2500000
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    genres: ['Crime', 'Drama'],
    releaseYear: 1972,
    duration: 175,
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    language: 'English',
    contentRating: 'R',
    averageRating: 4.7,
    ratingCount: 1800000
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genres: ['Action', 'Crime', 'Drama'],
    releaseYear: 2008,
    duration: 152,
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    language: 'English',
    contentRating: 'PG-13',
    averageRating: 4.6,
    ratingCount: 2400000
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    genres: ['Crime', 'Drama'],
    releaseYear: 1994,
    duration: 154,
    director: 'Quentin Tarantino',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    language: 'English',
    contentRating: 'R',
    averageRating: 4.5,
    ratingCount: 2000000
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    releaseYear: 2010,
    duration: 148,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
    language: 'English',
    contentRating: 'PG-13',
    averageRating: 4.5,
    ratingCount: 2200000
  },
  {
    title: 'Toy Story',
    description: 'A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy\'s room.',
    genres: ['Animation', 'Adventure', 'Comedy'],
    releaseYear: 1995,
    duration: 81,
    director: 'John Lasseter',
    cast: ['Tom Hanks', 'Tim Allen', 'Don Rickles'],
    language: 'English',
    contentRating: 'G',
    averageRating: 4.4,
    ratingCount: 900000
  }
];

const sampleSongs = [
  {
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    genres: ['Rock', 'Opera', 'Progressive Rock'],
    duration: 355,
    releaseYear: 1975,
    popularity: 95,
    averageRating: 4.9,
    ratingCount: 500000
  },
  {
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    genres: ['Rock', 'Folk Rock'],
    duration: 482,
    releaseYear: 1971,
    popularity: 94,
    averageRating: 4.8,
    ratingCount: 450000
  },
  {
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    genres: ['Rock', 'Soft Rock'],
    duration: 391,
    releaseYear: 1977,
    popularity: 93,
    averageRating: 4.7,
    ratingCount: 400000
  },
  {
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    album: 'Thriller',
    genres: ['Pop', 'Funk', 'R&B'],
    duration: 294,
    releaseYear: 1982,
    popularity: 96,
    averageRating: 4.8,
    ratingCount: 600000
  },
  {
    title: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    genres: ['Pop', 'Rock'],
    duration: 183,
    releaseYear: 1971,
    popularity: 92,
    averageRating: 4.6,
    ratingCount: 350000
  },
  {
    title: 'Like a Rolling Stone',
    artist: 'Bob Dylan',
    album: 'Highway 61 Revisited',
    genres: ['Rock', 'Folk Rock'],
    duration: 366,
    releaseYear: 1965,
    popularity: 91,
    averageRating: 4.7,
    ratingCount: 300000
  }
];

const sampleBooks = [
  {
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel about totalitarianism and surveillance.',
    genres: ['Fiction', 'Dystopian', 'Political Fiction'],
    isbn: '978-0451524935',
    pages: 328,
    publishYear: 1949,
    publisher: 'Secker & Warburg',
    averageRating: 4.5,
    ratingCount: 3000000
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    genres: ['Fiction', 'Classic', 'Coming-of-Age'],
    isbn: '978-0061120084',
    pages: 324,
    publishYear: 1960,
    publisher: 'J.B. Lippincott & Co.',
    averageRating: 4.7,
    ratingCount: 5000000
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel about the Jazz Age and the American Dream.',
    genres: ['Fiction', 'Classic', 'Literary Fiction'],
    isbn: '978-0743273565',
    pages: 180,
    publishYear: 1925,
    publisher: 'Charles Scribner\'s Sons',
    averageRating: 4.4,
    ratingCount: 4000000
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    description: 'The first book in the Harry Potter series about a young wizard.',
    genres: ['Fantasy', 'Young Adult', 'Fiction'],
    isbn: '978-0747532699',
    pages: 223,
    publishYear: 1997,
    publisher: 'Bloomsbury',
    averageRating: 4.6,
    ratingCount: 8000000
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    description: 'An epic fantasy trilogy about the quest to destroy the One Ring.',
    genres: ['Fantasy', 'Fiction', 'Adventure'],
    isbn: '978-0618640157',
    pages: 1178,
    publishYear: 1954,
    publisher: 'Allen & Unwin',
    averageRating: 4.8,
    ratingCount: 6000000
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners about Elizabeth Bennet and Mr. Darcy.',
    genres: ['Fiction', 'Romance', 'Classic'],
    isbn: '978-0141439518',
    pages: 432,
    publishYear: 1813,
    publisher: 'T. Egerton',
    averageRating: 4.6,
    ratingCount: 3500000
  }
];

const sampleSeries = [
  {
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student.',
    genres: ['Crime', 'Drama', 'Thriller'],
    releaseYear: 2008,
    endYear: 2013,
    seasons: 5,
    episodes: 62,
    creators: ['Vince Gilligan'],
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
    language: 'English',
    contentRating: 'TV-14',
    averageRating: 4.9,
    ratingCount: 1800000
  },
  {
    title: 'Game of Thrones',
    description: 'Nine noble families fight for control over the lands of Westeros.',
    genres: ['Fantasy', 'Drama', 'Adventure'],
    releaseYear: 2011,
    endYear: 2019,
    seasons: 8,
    episodes: 73,
    creators: ['David Benioff', 'D.B. Weiss'],
    cast: ['Sean Bean', 'Peter Dinklage', 'Emilia Clarke'],
    language: 'English',
    contentRating: 'TV-MA',
    averageRating: 4.6,
    ratingCount: 2000000
  },
  {
    title: 'The Office',
    description: 'A mockumentary on a group of typical office workers.',
    genres: ['Comedy'],
    releaseYear: 2005,
    endYear: 2013,
    seasons: 9,
    episodes: 201,
    creators: ['Greg Daniels'],
    cast: ['Steve Carell', 'John Krasinski', 'Jenna Fischer'],
    language: 'English',
    contentRating: 'TV-14',
    averageRating: 4.7,
    ratingCount: 1500000
  },
  {
    title: 'Stranger Things',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments.',
    genres: ['Sci-Fi', 'Horror', 'Drama'],
    releaseYear: 2016,
    seasons: 4,
    episodes: 34,
    creators: ['The Duffer Brothers'],
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour'],
    language: 'English',
    contentRating: 'TV-14',
    averageRating: 4.5,
    ratingCount: 1200000
  },
  {
    title: 'The Crown',
    description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign.',
    genres: ['Drama', 'History'],
    releaseYear: 2016,
    endYear: 2023,
    seasons: 6,
    episodes: 60,
    creators: ['Peter Morgan'],
    cast: ['Claire Foy', 'Olivia Colman', 'Imelda Staunton'],
    language: 'English',
    contentRating: 'TV-MA',
    averageRating: 4.4,
    ratingCount: 800000
  },
  {
    title: 'Friends',
    description: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends.',
    genres: ['Comedy', 'Romance'],
    releaseYear: 1994,
    endYear: 2004,
    seasons: 10,
    episodes: 236,
    creators: ['David Crane', 'Marta Kauffman'],
    cast: ['Jennifer Aniston', 'Courteney Cox', 'Lisa Kudrow'],
    language: 'English',
    contentRating: 'TV-14',
    averageRating: 4.6,
    ratingCount: 1000000
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recohub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await Song.deleteMany({});
    await Book.deleteMany({});
    await Series.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample data
    await Movie.insertMany(sampleMovies);
    console.log(`Inserted ${sampleMovies.length} movies`);

    await Song.insertMany(sampleSongs);
    console.log(`Inserted ${sampleSongs.length} songs`);

    await Book.insertMany(sampleBooks);
    console.log(`Inserted ${sampleBooks.length} books`);

    await Series.insertMany(sampleSeries);
    console.log(`Inserted ${sampleSeries.length} series`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
