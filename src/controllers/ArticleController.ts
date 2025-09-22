import { Request, Response } from 'express';
import { ArticleService } from '../services';
import { createArticleSchema, updateArticleSchema, paginationSchema, objectIdSchema } from '../middleware/validation';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class ArticleController {
  private articleService: ArticleService;

  constructor() {
    this.articleService = new ArticleService();
  }

  /**
   * Create a new article
   * POST /api/v1/articles
   */
  createArticle = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = createArticleSchema.validate(req.body);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const article = await this.articleService.createArticle(value);

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  });

  /**
   * Get all articles with pagination
   * GET /api/v1/articles
   */
  getArticles = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const { limit, offset, page } = value;
    
    // If page is provided, calculate offset
    const actualOffset = page ? (page - 1) * limit : offset;

    const result = await this.articleService.getArticles(limit, actualOffset);

    res.status(200).json({
      success: true,
      message: 'Articles retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Get single article by ID
   * GET /api/v1/articles/:id
   */
  getArticleById = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = objectIdSchema.validate(req.params.id);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const article = await this.articleService.getArticleById(value);
    if (!article) {
      throw createError('Article not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Article retrieved successfully',
      data: article,
    });
  });

  /**
   * Update article by ID
   * PUT /api/v1/articles/:id
   */
  updateArticle = asyncHandler(async (req: Request, res: Response) => {
    const { error: paramError, value: paramValue } = objectIdSchema.validate(req.params.id);
    if (paramError) {
      throw createError(paramError.details?.[0]?.message || 'Validation error', 400);
    }

    const { error: bodyError, value: bodyValue } = updateArticleSchema.validate(req.body);
    if (bodyError) {
      throw createError(bodyError.details?.[0]?.message || 'Validation error', 400);
    }

    const article = await this.articleService.updateArticle(paramValue, bodyValue);
    if (!article) {
      throw createError('Article not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: article,
    });
  });

  /**
   * Delete article by ID
   * DELETE /api/v1/articles/:id
   */
  deleteArticle = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = objectIdSchema.validate(req.params.id);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const deleted = await this.articleService.deleteArticle(value);
    if (!deleted) {
      throw createError('Article not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  });

  /**
   * Search articles
   * GET /api/v1/articles/search
   */
  searchArticles = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = paginationSchema.keys({
      q: req.query.q ? req.query.q : undefined,
    }).validate(req.query);
    
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    if (!value.q) {
      throw createError('Search query parameter "q" is required', 400);
    }

    const { limit, offset, page, q } = value;
    const actualOffset = page ? (page - 1) * limit : offset;

    const result = await this.articleService.searchArticles(q, limit, actualOffset);

    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: result.data,
      pagination: result.pagination,
      query: q,
    });
  });
}