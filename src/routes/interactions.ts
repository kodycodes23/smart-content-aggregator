import { Router } from 'express';
import { InteractionController } from '../controllers';

const router = Router();
const interactionController = new InteractionController();

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
 *                 example: "64f8b2e8d4c5e6f7a8b9c0d1"
 *               articleId:
 *                 type: string
 *                 example: "64f8b2e8d4c5e6f7a8b9c0d2"
 *               interactionType:
 *                 type: string
 *                 enum: [view, like]
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
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Interaction'
 *       400:
 *         description: Validation error
 */
router.post('/', interactionController.createInteraction);

/**
 * @swagger
 * /interactions:
 *   get:
 *     summary: Get all interactions (admin function)
 *     tags: [Interactions]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: All interactions retrieved successfully
 */
router.get('/', interactionController.getAllInteractions);

/**
 * @swagger
 * /interactions:
 *   delete:
 *     summary: Remove an interaction
 *     tags: [Interactions]
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
 *               articleId:
 *                 type: string
 *               interactionType:
 *                 type: string
 *                 enum: [view, like]
 *     responses:
 *       200:
 *         description: Interaction removed successfully
 *       404:
 *         description: Interaction not found
 */
router.delete('/', interactionController.removeInteraction);

/**
 * @swagger
 * /interactions/check:
 *   get:
 *     summary: Check if user has specific interaction with article
 *     tags: [Interactions]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *       - in: query
 *         name: interactionType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [view, like]
 *         description: Interaction type
 *     responses:
 *       200:
 *         description: Interaction check completed
 *       400:
 *         description: Missing required parameters
 */
router.get('/check', interactionController.checkInteraction);

/**
 * @swagger
 * /interactions/user/{userId}:
 *   get:
 *     summary: Get interactions by user ID
 *     tags: [Interactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: User interactions retrieved successfully
 */
router.get('/user/:userId', interactionController.getInteractionsByUser);

/**
 * @swagger
 * /interactions/article/{articleId}:
 *   get:
 *     summary: Get interactions by article ID
 *     tags: [Interactions]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *       - in: query
 *         name: interactionType
 *         schema:
 *           type: string
 *           enum: [view, like]
 *         description: Filter by interaction type
 *     responses:
 *       200:
 *         description: Article interactions retrieved successfully
 */
router.get('/article/:articleId', interactionController.getInteractionsByArticle);

/**
 * @swagger
 * /interactions/stats/{articleId}:
 *   get:
 *     summary: Get interaction statistics for an article
 *     tags: [Interactions]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Interaction statistics retrieved successfully
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
 *                     views:
 *                       type: number
 *                     likes:
 *                       type: number
 *                     totalInteractions:
 *                       type: number
 */
router.get('/stats/:articleId', interactionController.getInteractionStats);

export default router;