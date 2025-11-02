from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from typing import List, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from pydantic import BaseModel
import httpx

load_dotenv()

app = FastAPI(title="RecoHub ML API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
mongo_client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/recohub"))
db = mongo_client.recohub

# Pydantic models
class RecommendationRequest(BaseModel):
    userId: str
    contentType: str
    limit: int = 10

class SimilarItemsRequest(BaseModel):
    contentId: str
    contentType: str
    limit: int = 10

# Content-based similarity computation
def compute_content_similarity(content_type: str):
    """Compute content-based similarity matrix"""
    collection_map = {
        'movie': 'movies',
        'song': 'songs',
        'book': 'books',
        'series': 'series'
    }
    
    collection_name = collection_map.get(content_type)
    if not collection_name:
        return None, None
    
    collection = db[collection_name]
    items = list(collection.find({}))
    
    if not items:
        return None, None
    
    # Create feature vectors from genres and description
    texts = []
    item_ids = []
    
    for item in items:
        item_id = str(item['_id'])
        item_ids.append(item_id)
        
        # Combine genres and description
        genres = ' '.join(item.get('genres', []))
        description = item.get('description', '') or item.get('title', '')
        
        if content_type == 'song':
            # For songs, also include artist and album
            artist = item.get('artist', '')
            album = item.get('album', '')
            text = f"{genres} {description} {artist} {album}"
        elif content_type == 'book':
            # For books, include author
            author = item.get('author', '')
            text = f"{genres} {description} {author}"
        else:
            text = f"{genres} {description}"
        
        texts.append(text)
    
    # Use TF-IDF vectorization
    if len(texts) == 0:
        return None, None
    
    vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
    try:
        tfidf_matrix = vectorizer.fit_transform(texts)
        similarity_matrix = cosine_similarity(tfidf_matrix)
        return similarity_matrix, item_ids
    except:
        return None, None

# Collaborative filtering (simplified user-based)
def get_user_ratings(user_id: str):
    """Get all ratings by a user"""
    from bson import ObjectId
    try:
        user_object_id = ObjectId(user_id)
    except:
        user_object_id = user_id
    ratings = list(db.ratings.find({'userId': user_object_id}))
    return {f"{r['contentType']}_{str(r['contentId'])}": r['rating'] for r in ratings}

def find_similar_users(user_id: str, min_common_items: int = 2):
    """Find users with similar rating patterns"""
    user_ratings = get_user_ratings(user_id)
    if not user_ratings:
        return []
    
    all_ratings = list(db.ratings.find({}))
    user_ratings_map = {}
    
    for rating in all_ratings:
        uid = str(rating['userId'])
        if uid not in user_ratings_map:
            user_ratings_map[uid] = {}
        key = f"{rating['contentType']}_{str(rating['contentId'])}"
        user_ratings_map[uid][key] = rating['rating']
    
    similar_users = []
    for other_user_id, other_ratings in user_ratings_map.items():
        if other_user_id == user_id:
            continue
        
        # Find common items
        common_items = set(user_ratings.keys()) & set(other_ratings.keys())
        if len(common_items) < min_common_items:
            continue
        
        # Calculate cosine similarity
        user_vec = [user_ratings[item] for item in common_items]
        other_vec = [other_ratings[item] for item in common_items]
        
        try:
            similarity = np.dot(user_vec, other_vec) / (
                np.linalg.norm(user_vec) * np.linalg.norm(other_vec) + 1e-10
            )
            if similarity > 0:
                similar_users.append((other_user_id, similarity))
        except:
            continue
    
    # Sort by similarity
    similar_users.sort(key=lambda x: x[1], reverse=True)
    return similar_users[:10]

@app.get("/")
async def root():
    return {"message": "RecoHub ML API is running"}

@app.post("/api/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """Get personalized recommendations using hybrid approach"""
    try:
        from bson import ObjectId
        user_id = request.userId
        content_type = request.contentType
        limit = request.limit
        
        collection_map = {
            'movie': 'movies',
            'song': 'songs',
            'book': 'books',
            'series': 'series'
        }
        
        collection_name = collection_map.get(content_type)
        if not collection_name:
            raise HTTPException(status_code=400, detail="Invalid content type")
        
        collection = db[collection_name]
        
        # Get user's ratings
        try:
            user_object_id = ObjectId(user_id)
        except:
            user_object_id = user_id
        
        user_ratings = list(db.ratings.find({
            'userId': user_object_id,
            'contentType': content_type
        }))
        
        rated_item_ids = [str(r['contentId']) for r in user_ratings]
        
        # Content-based recommendations
        similarity_matrix, item_ids = compute_content_similarity(content_type)
        content_scores = {}
        
        if similarity_matrix is not None and rated_item_ids:
            for rating in user_ratings:
                rated_id = str(rating['contentId'])
                if rated_id in item_ids:
                    idx = item_ids.index(rated_id)
                    similarity_scores = similarity_matrix[idx]
                    
                    for i, item_id in enumerate(item_ids):
                        if item_id not in rated_item_ids:
                            if item_id not in content_scores:
                                content_scores[item_id] = 0
                            # Weight by user's rating
                            content_scores[item_id] += similarity_scores[i] * rating['rating']
        
        # Collaborative filtering recommendations
        similar_users = find_similar_users(user_id)
        collab_scores = {}
        
        for other_user_id, similarity in similar_users:
            try:
                other_user_object_id = ObjectId(other_user_id)
            except:
                other_user_object_id = other_user_id
            other_ratings = list(db.ratings.find({
                'userId': other_user_object_id,
                'contentType': content_type
            }))
            
            for rating in other_ratings:
                item_id = str(rating['contentId'])
                if item_id not in rated_item_ids:
                    if item_id not in collab_scores:
                        collab_scores[item_id] = 0
                    collab_scores[item_id] += rating['rating'] * similarity
        
        # Hybrid: combine both approaches
        final_scores = {}
        
        # Normalize content scores
        max_content = max(content_scores.values()) if content_scores else 1
        for item_id, score in content_scores.items():
            normalized_score = score / max_content if max_content > 0 else score
            final_scores[item_id] = normalized_score * 0.6  # 60% weight
        
        # Normalize collaborative scores
        max_collab = max(collab_scores.values()) if collab_scores else 1
        for item_id, score in collab_scores.items():
            normalized_score = score / max_collab if max_collab > 0 else score
            final_scores[item_id] = final_scores.get(item_id, 0) + normalized_score * 0.4  # 40% weight
        
        # Sort by score and get top items
        sorted_items = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)[:limit]
        
        # If not enough recommendations, add popular items
        if len(sorted_items) < limit:
            popular_items = list(collection.find({
                '_id': {'$nin': [r['contentId'] for r in user_ratings]}
            }).sort('averageRating', -1).limit(limit - len(sorted_items)))
            
            for item in popular_items:
                item_id = str(item['_id'])
                if item_id not in [x[0] for x in sorted_items]:
                    sorted_items.append((item_id, item.get('averageRating', 0)))
        
        # Get full item details
        recommended_items = []
        for item_id, score in sorted_items[:limit]:
            try:
                item_object_id = ObjectId(item_id)
            except:
                item_object_id = item_id
            item = collection.find_one({'_id': item_object_id})
            if item:
                item['_id'] = str(item['_id'])
                item['recommendationScore'] = round(score, 3)
                recommended_items.append(item)
        
        return {"recommendations": recommended_items}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trending/{content_type}")
async def get_trending(content_type: str, limit: int = 10):
    """Get trending items based on ratings and popularity"""
    try:
        collection_map = {
            'movie': 'movies',
            'song': 'songs',
            'book': 'books',
            'series': 'series'
        }
        
        collection_name = collection_map.get(content_type)
        if not collection_name:
            raise HTTPException(status_code=400, detail="Invalid content type")
        
        collection = db[collection_name]
        
        # Get items sorted by combination of rating and rating count
        items = list(collection.find({}).sort([
            ('ratingCount', -1),
            ('averageRating', -1)
        ]).limit(limit))
        
        # Convert ObjectId to string
        for item in items:
            item['_id'] = str(item['_id'])
        
        return {"trending": items}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/similar")
async def get_similar_items(request: SimilarItemsRequest):
    """Get similar items based on content similarity"""
    try:
        from bson import ObjectId
        content_id = request.contentId
        content_type = request.contentType
        limit = request.limit
        
        similarity_matrix, item_ids = compute_content_similarity(content_type)
        
        if similarity_matrix is None or content_id not in item_ids:
            # Fallback to random items
            collection_map = {
                'movie': 'movies',
                'song': 'songs',
                'book': 'books',
                'series': 'series'
            }
            collection = db[collection_map.get(content_type)]
            items = list(collection.find({'_id': {'$ne': content_id}}).limit(limit))
            for item in items:
                item['_id'] = str(item['_id'])
            return {"similar": items}
        
        idx = item_ids.index(content_id)
        similarity_scores = similarity_matrix[idx]
        
        # Get top similar items (excluding the item itself)
        similar_indices = np.argsort(similarity_scores)[::-1][1:limit+1]
        
        collection_map = {
            'movie': 'movies',
            'song': 'songs',
            'book': 'books',
            'series': 'series'
        }
        collection = db[collection_map.get(content_type)]
        
        similar_items = []
        for i in similar_indices:
            item_id = item_ids[i]
            try:
                item_object_id = ObjectId(item_id)
            except:
                item_object_id = item_id
            item = collection.find_one({'_id': item_object_id})
            if item:
                item['_id'] = str(item['_id'])
                item['similarity'] = round(float(similarity_scores[i]), 3)
                similar_items.append(item)
        
        return {"similar": similar_items}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
