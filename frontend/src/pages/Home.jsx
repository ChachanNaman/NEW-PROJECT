import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to RecoHub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your Multi-Domain Recommendation System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/movies"
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">🎬</div>
            <h2 className="text-xl font-bold mb-2">Movies</h2>
            <p className="text-blue-100">Discover and rate movies</p>
          </Link>

          <Link
            to="/songs"
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">🎵</div>
            <h2 className="text-xl font-bold mb-2">Songs</h2>
            <p className="text-purple-100">Explore music and artists</p>
          </Link>

          <Link
            to="/books"
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-xl font-bold mb-2">Books</h2>
            <p className="text-green-100">Find your next read</p>
          </Link>

          <Link
            to="/series"
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">📺</div>
            <h2 className="text-xl font-bold mb-2">Web Series</h2>
            <p className="text-red-100">Binge-watch recommendations</p>
          </Link>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start">
              <span className="text-2xl mr-4">1️⃣</span>
              <div>
                <h3 className="font-semibold mb-1">Create Your Account</h3>
                <p>Sign up and set your preferences to get personalized recommendations.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-4">2️⃣</span>
              <div>
                <h3 className="font-semibold mb-1">Rate Content</h3>
                <p>Rate movies, songs, books, and series you've experienced.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-4">3️⃣</span>
              <div>
                <h3 className="font-semibold mb-1">Get Recommendations</h3>
                <p>Our AI-powered system suggests new content based on your tastes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
