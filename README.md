# Smart Content Aggregator API

A well-structured RESTful API for a content aggregator service built with Node.js, Express, TypeScript, and MongoDB.


## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (MongoDB Atlas)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Environment Configuration
NODE_ENV=development
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://agoruakody_db:j4TeSJB0sF8mYk0L@tobamsaggregator.zvb7pyo.mongodb.net/?retryWrites=true&w=majority&appName=tobamsaggregator

# API Configuration
API_VERSION=v1

# CORS Configuration (optional)
CORS_ORIGIN=*
```

### 3. MongoDB Setup
Make sure MongoDB is running locally, or update the `MONGODB_URI` in your `.env` file to point to my already created  MongoDB Atlas cluster:
```

```

### 4. Build the Project
```bash
npm run build
```

### 5. Start the Server

#### Development Mode (with hot reload)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start at `http://localhost:3000`

##  API Documentation

Once the server is running, you can access:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI JSON**: `http://localhost:3000/api-docs.json`


### Test the Recommendation System
Run the included test script to see the recommendation system in action:
```bash
# Make sure the server is running first (npm run dev)
node test-recommendations.js
```

This script will:
1. Create test users with different interests
2. Create sample articles with relevant content
3. Generate interactions for popularity-based recommendations
4. Request personalized recommendations
5. Display trending articles
6. Show algorithm information

##  Recommendation System

The API includes a sophisticated rule-based recommendation system that provides personalized article suggestions for users. The system is designed to be simple yet effective, avoiding complex ML models while still delivering relevant recommendations.

### Algorithm Overview

The recommendation system uses a **hybrid approach** combining two main strategies:

1. **Interest-Based Recommendations (60% weight)**
2. **Popularity-Based Recommendations (40% weight)**

### Interest-Based Recommendations

This algorithm matches articles to users based on their stated interests:

#### Matching Logic:
- **Title Match**: Articles whose titles contain user interests (weight: 3 points)
- **Summary Match**: Articles whose summaries contain user interests (weight: 2 points)
- **Content Match**: Articles whose content contains user interests (weight: 1 point)
- **Multiple Interests Bonus**: Additional 0.5 points for each matched interest

#### Example:
If a user's interests are `["tech", "programming"]` and an article titled "Advanced TypeScript Programming Techniques" with summary "A deep dive into tech concepts...", it would score:
- Title match for "programming": 3 points
- Summary match for "tech": 2 points
- Multiple interests bonus: 0.5 points
- **Total: 5.5 points**

### Popularity-Based Recommendations

This algorithm recommends articles based on overall user engagement:

#### Scoring Formula:
```
Popularity Score = (Likes × 2) + (Views × 1)
```

#### Logic:
- **Likes are weighted higher** than views (likes = 2x, views = 1x)
- Only articles with existing interactions are considered
- Score is normalized to be lower than interest-based scores

### Filtering & Ranking

#### Exclusion Rules:
- **Already Viewed**: Articles the user has previously viewed are excluded
- **Duplicate Prevention**: Ensures no article appears twice in recommendations

#### Final Ranking:
1. Combine interest-based and popularity-based recommendations
2. Sort by score (descending)
3. Return top N results (default: 10, max: 50)

### Additional Features

#### Trending Articles
- Separate endpoint for globally trending content
- Based on recent interaction volume
- Useful fallback when personalized recommendations are insufficient

#### Algorithm Transparency
- Each recommendation includes a `reason` field explaining why it was suggested
- `matchedInterests` array shows which user interests matched
- Metadata provides breakdown of recommendation types

### Example Response
```json
{
  "success": true,
  "data": [
    {
      "article": { /* article object */ },
      "score": 5.5,
      "reason": "Matches your interests: tech, programming",
      "matchedInterests": ["tech", "programming"]
    }
  ],
  "user": {
    "id": "64f8b2e8d4c5e6f7a8b9c0d1",
    "username": "johndoe",
    "interests": ["tech", "programming", "ai"]
  },
  "metadata": {
    "interestBasedCount": 6,
    "popularityBasedCount": 4,
    "algorithm": "rule-based-v1"
  }
}
```

NB: i added a couple of other endpoints based on utility,i used them during the course of my development at one point, the other endpoints like delete article or update article because it would be easier to do that than to be going to search for it in mongo db so i felt it would be a waste to create them and not include them so i added a few extra endpoints beyond the core requirements in my swagger

```

## 📄 License

ISC License

## 👤 Author

kody

---

