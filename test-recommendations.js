#!/usr/bin/env node

/**
 * Test script for the Smart Content Aggregator API
 * Demonstrates the recommendation system functionality
 */

const BASE_URL = 'http://localhost:3000/api/v1';

// Helper function to make HTTP requests
async function makeRequest(method, url, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
}

async function testRecommendationSystem() {
  console.log('🧪 Testing Smart Content Aggregator Recommendation System\n');

  try {
    // 1. Create test user with interests
    console.log('1️⃣ Creating test user...');
    const userResponse = await makeRequest('POST', `${BASE_URL}/users`, {
      username: 'testuser_' + Date.now(),
      interests: ['javascript', 'programming', 'tech', 'ai']
    });

    if (userResponse.status !== 201) {
      console.error('❌ Failed to create user:', userResponse.data);
      return;
    }

    const userId = userResponse.data.data._id;
    console.log('✅ User created:', userResponse.data.data.username);
    console.log('   Interests:', userResponse.data.data.interests.join(', '));

    // 2. Create test articles
    console.log('\n2️⃣ Creating test articles...');
    const articles = [
      {
        title: 'Advanced JavaScript Programming Techniques',
        content: 'Learn advanced JavaScript concepts including closures, prototypes, and async programming.',
        author: 'Jane Smith',
        summary: 'A comprehensive guide to JavaScript programming'
      },
      {
        title: 'Introduction to Artificial Intelligence',
        content: 'Explore the fundamentals of AI, machine learning, and neural networks.',
        author: 'Dr. Alex Johnson',
        summary: 'AI basics for beginners in tech'
      },
      {
        title: 'Database Design Principles',
        content: 'Best practices for designing scalable and efficient databases.',
        author: 'Bob Wilson',
        summary: 'Database design fundamentals'
      },
      {
        title: 'Python vs JavaScript: A Developer\'s Guide',
        content: 'Compare programming languages and choose the right tool for your project.',
        author: 'Sarah Davis',
        summary: 'Programming language comparison guide'
      }
    ];

    const articleIds = [];
    for (const article of articles) {
      const response = await makeRequest('POST', `${BASE_URL}/articles`, article);
      if (response.status === 201) {
        articleIds.push(response.data.data._id);
        console.log(`✅ Created: "${article.title}"`);
      }
    }

    // 3. Create some interactions for popularity-based recommendations
    console.log('\n3️⃣ Creating sample interactions...');
    
    // Create another user to generate interactions
    const user2Response = await makeRequest('POST', `${BASE_URL}/users`, {
      username: 'user2_' + Date.now(),
      interests: ['python', 'data']
    });
    
    if (user2Response.status === 201) {
      const user2Id = user2Response.data.data._id;
      
      // Add interactions to make some articles popular
      for (let i = 0; i < 2; i++) {
        await makeRequest('POST', `${BASE_URL}/interactions`, {
          userId: user2Id,
          articleId: articleIds[0], // JavaScript article
          interactionType: 'like'
        });
        await makeRequest('POST', `${BASE_URL}/interactions`, {
          userId: user2Id,
          articleId: articleIds[1], // AI article
          interactionType: 'view'
        });
      }
      console.log('✅ Sample interactions created');
    }

    // 4. Test recommendations
    console.log('\n4️⃣ Getting recommendations...');
    const recResponse = await makeRequest('GET', `${BASE_URL}/recommendations/${userId}?limit=5`);
    
    if (recResponse.status === 200) {
      console.log('✅ Recommendations generated successfully!\n');
      
      const { data, user, metadata } = recResponse.data;
      
      console.log(`👤 User: ${user.username}`);
      console.log(`🎯 Interests: ${user.interests.join(', ')}`);
      console.log(`📊 Algorithm: ${metadata.algorithm}`);
      console.log(`🔍 Interest-based: ${metadata.interestBasedCount}`);
      console.log(`📈 Popularity-based: ${metadata.popularityBasedCount}\n`);
      
      console.log('🎯 Recommendations:');
      data.forEach((rec, index) => {
        console.log(`\n${index + 1}. ${rec.article.title}`);
        console.log(`   Score: ${rec.score.toFixed(2)}`);
        console.log(`   Reason: ${rec.reason}`);
        if (rec.matchedInterests) {
          console.log(`   Matched Interests: ${rec.matchedInterests.join(', ')}`);
        }
        console.log(`   Author: ${rec.article.author}`);
      });
    } else {
      console.error('❌ Failed to get recommendations:', recResponse.data);
    }

    // 5. Test trending articles
    console.log('\n\n5️⃣ Getting trending articles...');
    const trendingResponse = await makeRequest('GET', `${BASE_URL}/recommendations/trending?limit=3`);
    
    if (trendingResponse.status === 200) {
      console.log('✅ Trending articles retrieved!\n');
      
      trendingResponse.data.data.forEach((trend, index) => {
        console.log(`${index + 1}. ${trend.article.title}`);
        console.log(`   ${trend.reason}`);
        console.log(`   Score: ${trend.score.toFixed(2)}\n`);
      });
    }

    // 6. Test algorithm info
    console.log('6️⃣ Getting algorithm information...');
    const infoResponse = await makeRequest('GET', `${BASE_URL}/recommendations/info`);
    
    if (infoResponse.status === 200) {
      console.log('✅ Algorithm info retrieved!\n');
      console.log(`Algorithm: ${infoResponse.data.data.algorithm}`);
      console.log(`Version: ${infoResponse.data.data.version}`);
      console.log(`Description: ${infoResponse.data.data.description}`);
      console.log('Features:');
      infoResponse.data.data.features.forEach(feature => {
        console.log(`  • ${feature}`);
      });
    }

    console.log('\n🎉 Recommendation system test completed successfully!');
    console.log('\n📚 Visit http://localhost:3000/api-docs to explore all endpoints');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if Node.js has fetch (Node 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This test script requires Node.js 18+ with built-in fetch support');
  console.log('   Alternatively, you can test the endpoints manually using curl or Postman');
  console.log('\n📋 Manual Test Commands:');
  console.log('curl -X POST http://localhost:3000/api/v1/users \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"username":"testuser","interests":["javascript","programming"]}\'');
  console.log('\ncurl "http://localhost:3000/api/v1/recommendations/{USER_ID}?limit=5"');
  process.exit(1);
} else {
  testRecommendationSystem();
}