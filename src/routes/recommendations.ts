import { Router } from 'express';
import { RecommendationController } from '../controllers';

const router = Router();
const recommendationController = new RecommendationController();

/**
 * @swagger
 * /recommendations/info:
 *   get:
 *     summary: Get recommendation algorithm information
 *     tags: [Recommendations]
 *     responses:
 *       200:
 *         description: Recommendation algorithm information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     algorithm:
 *                       type: string
 *                       example: "rule-based-v1"
 *                     version:
 *                       type: string
 *                       example: "1.0.0"
 *                     description:
 *                       type: string
 *                     features:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get('/info', recommendationController.getRecommendationInfo);

/**
 * @swagger
 * /recommendations/trending:
 *   get:
 *     summary: Get trending articles
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of trending articles to return
 *     responses:
 *       200:
 *         description: Trending articles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       article:
 *                         $ref: '#/components/schemas/Article'
 *                       score:
 *                         type: number
 *                       reason:
 *                         type: string
 *       400:
 *         description: Invalid limit parameter
 */
router.get('/trending', recommendationController.getTrendingArticles);

/**
 * @swagger
 * /recommendations/{userId}:
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
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to get recommendations for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of recommendations to return
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       article:
 *                         $ref: '#/components/schemas/Article'
 *                       score:
 *                         type: number
 *                         description: Recommendation score
 *                       reason:
 *                         type: string
 *                         description: Reason for recommendation
 *                       matchedInterests:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: User interests that matched this article
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     interests:
 *                       type: array
 *                       items:
 *                         type: string
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     interestBasedCount:
 *                       type: number
 *                       description: Number of interest-based recommendations
 *                     popularityBasedCount:
 *                       type: number
 *                       description: Number of popularity-based recommendations
 *                     algorithm:
 *                       type: string
 *                       description: Algorithm used for recommendations
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     returned:
 *                       type: number
 *       400:
 *         description: Invalid user ID or limit parameter
 *       404:
 *         description: User not found
 */
router.get('/:userId', recommendationController.getRecommendationsForUser);

export default router;