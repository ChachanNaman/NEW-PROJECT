# RecoHub - Multi-Domain Recommendation System

A full-stack recommendation system for Movies, Songs, Books, and Web Series with personalized AI-powered recommendations.

## Tech Stack

- **Frontend**: React.js (JavaScript/JSX) with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **ML API**: Python with FastAPI

## Project Structure

```
RecoHub/
├── backend/          # Node.js/Express backend
├── frontend/         # React.js frontend
└── ml-api/          # Python FastAPI ML service
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (running locally or connection string)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/recohub
JWT_SECRET=your-secret-key-change-in-production
ML_API_URL=http://localhost:8000
```

5. Seed the database:
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5001`

### ML API Setup

1. Navigate to ml-api directory:
```bash
cd ml-api
```

2. Create virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Update `.env` with your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/recohub
```

6. Start the ML API:
```bash
python main.py
# or
uvicorn main:app --reload
```

ML API will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Features

- **Authentication**: JWT-based user authentication with role support (user/kid)
- **Content Management**: Browse and search Movies, Songs, Books, and Web Series
- **Ratings**: Rate content and see community ratings
- **Recommendations**: Personalized recommendations using hybrid content-based and collaborative filtering
- **Trending**: See trending content across all domains
- **Filtering**: Filter content by genre, search, and sort options
- **User Profiles**: Manage preferences and account settings

## API Endpoints

### Backend API (Port 5001)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/movies` - Get movies (with filters)
- `GET /api/songs` - Get songs (with filters)
- `GET /api/books` - Get books (with filters)
- `GET /api/series` - Get series (with filters)
- `POST /api/ratings` - Create/update rating
- `GET /api/search` - Global search

### ML API (Port 8000)

- `POST /api/recommendations` - Get personalized recommendations
- `GET /api/trending/{contentType}` - Get trending items
- `POST /api/similar` - Get similar items

## Default Sample Data

The database seed script includes sample data from:
- Movies: Classic and popular films
- Songs: Iconic tracks across genres
- Books: Beloved literary works
- Series: Popular web series and TV shows

## Development

- Backend runs on port 5001
- ML API runs on port 8000
- Frontend runs on port 3000

Make sure all three services are running for the complete application to work.

## License

MIT
