import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContentCard from '../components/ContentCard';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const ContentPage = ({ contentType, title, icon }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    sortBy: contentType === 'song' ? 'popularity' : 'averageRating',
    order: 'desc',
  });
  const [genres, setGenres] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchContent();
    fetchGenres();
    fetchTrending();
    if (user) {
      fetchRecommendations();
    }
  }, [page, filters, contentType]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 20,
        ...filters,
      };
      // Map content type to API endpoint
      const contentTypeMap = {
        movies: 'movies',
        songs: 'songs',
        books: 'books',
        series: 'series'
      };
      const apiContentType = contentTypeMap[contentType] || contentType;
      const contentEndpoint = api.content[apiContentType];
      const response = await axios.get(contentEndpoint, { params });
      const responseKey = apiContentType;
      setItems(response.data[responseKey] || []);
      setFilteredItems(response.data[responseKey] || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const contentTypeMap = {
        movies: 'movies',
        songs: 'songs',
        books: 'books',
        series: 'series'
      };
      const apiContentType = contentTypeMap[contentType] || contentType;
      const contentEndpoint = api.content[apiContentType];
      const response = await axios.get(`${contentEndpoint}/meta/genres`);
      setGenres(response.data || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchTrending = async () => {
    try {
      // Map to ML API content type format (singular)
      const mlContentTypeMap = {
        movies: 'movie',
        songs: 'song',
        books: 'book',
        series: 'series'
      };
      const mlContentType = mlContentTypeMap[contentType] || contentType;
      const response = await axios.get(`${api.ml.trending}/${mlContentType}`, {
        params: { limit: 5 },
      });
      setTrending(response.data.trending || []);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const fetchRecommendations = async () => {
    if (!user) return;
    try {
      // Map to ML API content type format (singular)
      const mlContentTypeMap = {
        movies: 'movie',
        songs: 'song',
        books: 'book',
        series: 'series'
      };
      const mlContentType = mlContentTypeMap[contentType] || contentType;
      const response = await axios.post(api.ml.recommendations, {
        userId: user.id,
        contentType: mlContentType,
        limit: 5,
      });
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const handleRatingUpdate = () => {
    fetchContent();
    fetchTrending();
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {icon} {title}
        </h1>
        <p className="text-gray-600">Discover and rate your favorite {title.toLowerCase()}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="averageRating">Rating</option>
            <option value={contentType === 'song' ? 'popularity' : 'releaseYear'}>
              {contentType === 'song' ? 'Popularity' : 'Year'}
            </option>
            <option value="title">Title</option>
          </select>
          <select
            value={filters.order}
            onChange={(e) => handleFilterChange('order', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map((item) => (
              <ContentCard
                key={item._id}
                item={item}
                contentType={contentType}
                onRatingUpdate={handleRatingUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trending.map((item) => (
              <ContentCard
                key={item._id}
                item={item}
                contentType={contentType}
                onRatingUpdate={handleRatingUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Content */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">All {title}</h2>
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No {title.toLowerCase()} found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <ContentCard
                key={item._id}
                item={item}
                contentType={contentType}
                onRatingUpdate={handleRatingUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentPage;
