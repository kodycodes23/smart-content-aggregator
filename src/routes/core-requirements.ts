import { Router } from 'express';

/**
 * Core Requirements Routes
 * This file defines the core endpoints as specified in the project requirements
 */

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: "📋 Core Requirements"
 *     description: "Core endpoints as specified in the project requirements"
 *   - name: "Articles"
 *     description: "Article management operations"
 *   - name: "Users" 
 *     description: "User management operations"
 *   - name: "Interactions"
 *     description: "User interaction tracking"
 *   - name: "Recommendations"
 *     description: "Content recommendation system"
 */

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: "2.1. Create a new article entry"
 *     description: |
 *       **Core Requirement**: Create a new article entry.
 *       
 *       **Request Body**: Should include fields like title, content, author, and a summary (which can be null or empty).
 *       
 *       **Note**: The summary field is key for one of the stretch goals.
 *     tags: ["📋 Core Requirements", "Articles"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 description: "Article title"
 *                 example: "Understanding TypeScript"
 *               content:
 *                 type: string
 *                 description: "Article content"
 *                 example: "TypeScript is a superset of JavaScript that adds static typing..."
 *               author:
 *                 type: string
 *                 description: "Article author"
 *                 example: "John Doe"
 *               summary:
 *                 type: string
 *                 nullable: true
 *                 description: "Article summary (optional)"
 *                 example: "A comprehensive guide to TypeScript basics"
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Article created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: "2.2. Retrieve a paginated list of articles"
 *     description: |
 *       **Core Requirement**: Retrieve a paginated list of articles.
 *       
 *       **Query Parameters**: Implement limit and offset (or page) for pagination.
 *     tags: ["📋 Core Requirements", "Articles"]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: "Number of articles per page"
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: "Number of articles to skip"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: "Page number (alternative to offset)"
 *     responses:
 *       200:
 *         description: Articles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Articles retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 25
 *                     page:
 *                       type: number
 *                       example: 1
 *                     limit:
 *                       type: number
 *                       example: 10
 *                     totalPages:
 *                       type: number
 *                       example: 3
 */

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: "2.3. Retrieve a single article by its ID"
 *     description: |
 *       **Core Requirement**: Retrieve a single article by its ID.
 *     tags: ["📋 Core Requirements", "Articles"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Article ID"
 *         example: "64f8b2e8d4c5e6f7a8b9c0d1"
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Article retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: "2.4. Create a simple user profile"
 *     description: |
 *       **Core Requirement**: Create a simple user profile.
 *       
 *       **Request Body**: Should include a unique username and an optional list of interests (e.g., tags like "tech", "sports").
 *     tags: ["📋 Core Requirements", "Users"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: "Unique username"
 *                 example: "johndoe"
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Optional list of interests/tags"
 *                 example: ["tech", "sports", "programming"]
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Username already exists
 */

/**
 * @swagger
 * /interactions:
 *   post:
 *     summary: "2.5. Record a user's interaction with an article"
 *     description: |
 *       **Core Requirement**: Record a user's interaction with an article (e.g., viewing or liking it).
 *       
 *       **Request Body**: Should include user_id, article_id, and interaction_type (e.g., 'view', 'like').
 *     tags: ["📋 Core Requirements", "Interactions"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - articleId
 *               - interactionType
 *             properties:
 *               userId:
 *                 type: string
 *                 description: "User ID"
 *                 example: "64f8b2e8d4c5e6f7a8b9c0d1"
 *               articleId:
 *                 type: string
 *                 description: "Article ID"
 *                 example: "64f8b2e8d4c5e6f7a8b9c0d2"
 *               interactionType:
 *                 type: string
 *                 enum: ["view", "like"]
 *                 description: "Type of interaction"
 *                 example: "like"
 *     responses:
 *       201:
 *         description: Interaction recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Interaction recorded successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Interaction'
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: "2.4. Create a simple user profile"
 *     description: |
 *       **Core Requirement**: Create a simple user profile.
 *       
 *       **Request Body**: Should include a unique username and an optional list of interests (e.g., tags like "tech", "sports").
 *     tags: ["📋 Core Requirements", "Users"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: "Unique username"
 *                 example: "johndoe"
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Optional list of interests/tags"
 *                 example: ["tech", "sports", "programming"]
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Username already exists
 */

/**
 * @swagger
 * /interactions:
 *   post:
 *     summary: "2.5. Record a user's interaction with an article"
 *     description: |
 *       **Core Requirement**: Record a user's interaction with an article (e.g., viewing or liking it).
 *       
 *       **Request Body**: Should include user_id, article_id, and interaction_type (e.g., 'view', 'like').
 *     tags: ["📋 Core Requirements", "Interactions"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - articleId
 *               - interactionType
 *             properties:
 *               userId:
 *                 type: string
 *                 description: "User ID"
 *                 example: "64f8b2e8d4c5e6f7a8b9c0d1"
 *               articleId:
 *                 type: string
 *                 description: "Article ID"
 *                 example: "64f8b2e8d4c5e6f7a8b9c0d2"
 *               interactionType:
 *                 type: string
 *                 enum: ["view", "like"]
 *                 description: "Type of interaction"
 *                 example: "like"
 *     responses:
 *       201:
 *         description: Interaction recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Interaction recorded successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Interaction'
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /recommendations/{user_id}:
 *   get:
 *     summary: "2.6. Get personalized article recommendations for a user"
 *     description: |
 *       **Core Requirement**: This endpoint returns a list of articles recommended for the given user.
 *       
 *       Uses a sophisticated rule-based algorithm that combines:
 *       - **Interest-based matching** (60% weight): Matches articles based on user's stated interests
 *       - **Popularity-based recommendations** (40% weight): Suggests popular articles user hasn't seen
 *       
 *       The system excludes articles the user has already viewed and provides transparent reasoning for each recommendation.
 *     tags: ["📋 Core Requirements", "Recommendations"]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "User ID to get recommendations for"
 *         example: "64f8b2e8d4c5e6f7a8b9c0d1"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: "Number of recommendations to return"
 *     responses:
 *       200:
 *         description: Recommendations generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Recommendations generated successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       article:
 *                         $ref: '#/components/schemas/Article'
 *                       score:
 *                         type: number
 *                         description: "Recommendation score"
 *                         example: 5.5
 *                       reason:
 *                         type: string
 *                         description: "Explanation for this recommendation"
 *                         example: "Matches your interests: tech, programming"
 *                       matchedInterests:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: "User interests that matched this article"
 *                         example: ["tech", "programming"]
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f8b2e8d4c5e6f7a8b9c0d1"
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                     interests:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["tech", "programming", "ai"]
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     interestBasedCount:
 *                       type: number
 *                       description: "Number of interest-based recommendations"
 *                       example: 6
 *                     popularityBasedCount:
 *                       type: number
 *                       description: "Number of popularity-based recommendations"
 *                       example: 4
 *                     algorithm:
 *                       type: string
 *                       description: "Algorithm version used"
 *                       example: "rule-based-v1"
 *       400:
 *         description: Invalid user ID or parameters
 *       404:
 *         description: User not found
 */

// This file only contains documentation - no actual routes
export default router;