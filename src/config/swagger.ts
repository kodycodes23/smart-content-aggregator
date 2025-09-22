import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Content Aggregator API',
      version: '1.0.0',
      description: `# Smart Content Aggregator API

A well-structured content aggregator REST API built with Node.js, Express, TypeScript, and MongoDB.

## 📋 Core Requirements Implementation

This API implements the following **core required endpoints** as specified in the project requirements:

### Articles Management
- **POST /articles** - Create a new article entry with title, content, author, and optional summary
- **GET /articles** - Retrieve a paginated list of articles (supports limit/offset and page parameters)
- **GET /articles/{id}** - Retrieve a single article by its unique ID

### User Management  
- **POST /users** - Create a simple user profile with unique username and optional interests list

### User Interactions
- **POST /interactions** - Record user interactions with articles (view/like tracking)

### Content Recommendations ✨
- **GET /recommendations/{user_id}** - Get personalized article recommendations using a rule-based algorithm

---

## 🚀 Additional Features

Beyond the core requirements, this API also provides:
- Full CRUD operations for all resources
- Comprehensive pagination support
- Input validation and error handling
- Swagger/OpenAPI documentation
- Trending articles endpoint
- Interaction statistics
- Algorithm transparency

## 🔗 Quick Links
- **Health Check**: GET /health
- **API Documentation**: Available below
- **Trending Articles**: GET /recommendations/trending`,
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-domain.com/api/v1' 
          : `http://localhost:${process.env.PORT || 3000}/api/v1`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    tags: [
      {
        name: '📋 Core Requirements',
        description: 'Core endpoints as specified in the project requirements',
      },
      {
        name: 'Articles',
        description: 'Article management operations',
      },
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Interactions',
        description: 'User interaction tracking',
      },
      {
        name: 'Recommendations',
        description: 'Content recommendation system',
      },
      {
        name: '🔧 Additional Features',
        description: 'Extra endpoints beyond core requirements',
      },
    ],
    components: {
      schemas: {
        Article: {
          type: 'object',
          required: ['title', 'content', 'author'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated unique identifier',
            },
            title: {
              type: 'string',
              description: 'Article title',
              example: 'Understanding TypeScript',
            },
            content: {
              type: 'string',
              description: 'Article content',
              example: 'TypeScript is a superset of JavaScript...',
            },
            author: {
              type: 'string',
              description: 'Article author',
              example: 'John Doe',
            },
            summary: {
              type: 'string',
              nullable: true,
              description: 'Article summary (optional)',
              example: 'A comprehensive guide to TypeScript basics',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        User: {
          type: 'object',
          required: ['username'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated unique identifier',
            },
            username: {
              type: 'string',
              description: 'Unique username',
              example: 'johndoe',
            },
            interests: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'User interests/tags',
              example: ['tech', 'sports', 'science'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Interaction: {
          type: 'object',
          required: ['userId', 'articleId', 'interactionType'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated unique identifier',
            },
            userId: {
              type: 'string',
              description: 'Reference to user ID',
              example: '64f8b2e8d4c5e6f7a8b9c0d1',
            },
            articleId: {
              type: 'string',
              description: 'Reference to article ID',
              example: '64f8b2e8d4c5e6f7a8b9c0d2',
            },
            interactionType: {
              type: 'string',
              enum: ['view', 'like'],
              description: 'Type of interaction',
              example: 'like',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            status: {
              type: 'number',
              description: 'HTTP status code',
            },
          },
        },
      },
    },
  },
  apis: [
    './src/routes/*.ts',
    './src/routes/core-requirements.ts',
    __dirname + '/../routes/*.ts',
    __dirname + '/../routes/core-requirements.ts'
  ], // Path to the API files
};

export const swaggerSpec = swaggerJSDoc(options);