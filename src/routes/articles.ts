import { Router } from 'express';
import { ArticleController } from '../controllers';

const router = Router();
const articleController = new ArticleController();

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
router.post('/', articleController.createArticle);

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
 *         description: Number of articles per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of articles to skip
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (alternative to offset)
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     totalPages:
 *                       type: number
 */
router.get('/', articleController.getArticles);

/**
 * @swagger
 * /articles/search:
 *   get:
 *     summary: Search articles by text
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
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
 *         description: Search completed successfully
 *       400:
 *         description: Missing search query
 */
router.get('/search', articleController.searchArticles);

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
 *         description: Article ID
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
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', articleController.getArticleById);

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Update article by ID (Additional Feature)
 *     description: Enhanced feature - Full article update capability beyond core requirements
 *     tags: ["🔧 Additional Features", "Articles"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *               summary:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       404:
 *         description: Article not found
 */
router.put('/:id', articleController.updateArticle);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete article by ID (Additional Feature)
 *     description: Enhanced feature - Article deletion capability beyond core requirements
 *     tags: ["🔧 Additional Features", "Articles"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       404:
 *         description: Article not found
 */
router.delete('/:id', articleController.deleteArticle);

export default router;