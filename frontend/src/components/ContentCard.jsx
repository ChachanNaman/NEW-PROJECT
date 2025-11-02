import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const ContentCard = ({ item, contentType, onRatingUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && item._id) {
      fetchUserRating();
    }
  }, [isAuthenticated, item._id]);

  const fetchUserRating = async () => {
    try {
      // Map to singular form for API
      const contentTypeMap = {
        movies: 'movie',
        songs: 'song',
        books: 'book',
        series: 'series'
      };
      const apiContentType = contentTypeMap[contentType] || contentType;
      const response = await axios.get(
        `${api.ratings.getRating}/${apiContentType}/${item._id}`
      );
      if (response.data.rating) {
        setUserRating(response.data.rating);
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  const handleRating = async (rating) => {
    if (!isAuthenticated) {
      alert('Please login to rate content');
      return;
    }

    setLoading(true);
    try {
      // Map to singular form for API
      const contentTypeMap = {
        movies: 'movie',
        songs: 'song',
        books: 'book',
        series: 'series'
      };
      const apiContentType = contentTypeMap[contentType] || contentType;
      await axios.post(api.ratings.create, {
        contentType: apiContentType,
        contentId: item._id,
        rating,
      });
      setUserRating(rating);
      if (onRatingUpdate) {
        onRatingUpdate();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = () => {
    if (contentType === 'movies' || contentType === 'movie' || contentType === 'series') {
      return item.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image';
    } else if (contentType === 'songs' || contentType === 'song') {
      return item.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image';
    } else if (contentType === 'books' || contentType === 'book') {
      return item.coverUrl || 'https://via.placeholder.com/300x450?text=No+Image';
    }
    return 'https://via.placeholder.com/300x300';
  };

  const getTitle = () => item.title || 'Unknown';
  const getSubtitle = () => {
    if (contentType === 'songs' || contentType === 'song') return item.artist || '';
    if (contentType === 'books' || contentType === 'book') return item.author || '';
    if (contentType === 'movies' || contentType === 'movie' || contentType === 'series') {
      return item.releaseYear || '';
    }
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={getImageUrl()}
        alt={getTitle()}
        className="w-full h-64 object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {getTitle()}
        </h3>
        {getSubtitle() && (
          <p className="text-sm text-gray-600 mb-2">{getSubtitle()}</p>
        )}
        
        {item.genres && item.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.genres.slice(0, 2).map((genre, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium">
              {item.averageRating?.toFixed(1) || 'N/A'}
            </span>
            <span className="text-xs text-gray-500">
              ({item.ratingCount || 0})
            </span>
          </div>
        </div>

        {/* Rating Stars */}
        {isAuthenticated && (
          <div className="border-t pt-3">
            <p className="text-xs text-gray-600 mb-2">Your Rating:</p>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={loading}
                  className={`text-2xl transition-colors ${
                    star <= (hoveredRating || userRating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  } hover:text-yellow-400 disabled:opacity-50`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
