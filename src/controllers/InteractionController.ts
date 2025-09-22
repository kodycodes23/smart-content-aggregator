import { Request, Response } from 'express';
import { InteractionService } from '../services';
import { createInteractionSchema, paginationSchema, objectIdSchema } from '../middleware/validation';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class InteractionController {
  private interactionService: InteractionService;

  constructor() {
    this.interactionService = new InteractionService();
  }

  /**
   * Create a new interaction
   * POST /api/v1/interactions
   */
  createInteraction = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = createInteractionSchema.validate(req.body);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const interaction = await this.interactionService.createInteraction(value);

    res.status(201).json({
      success: true,
      message: 'Interaction recorded successfully',
      data: interaction,
    });
  });

  /**
   * Get interactions by user ID
   * GET /api/v1/interactions/user/:userId
   */
  getInteractionsByUser = asyncHandler(async (req: Request, res: Response) => {
    const { error: paramError, value: userId } = objectIdSchema.validate(req.params.userId);
    if (paramError) {
      throw createError(paramError.details?.[0]?.message || 'Validation error', 400);
    }

    const { error: queryError, value: queryValue } = paginationSchema.validate(req.query);
    if (queryError) {
      throw createError(queryError.details?.[0]?.message || 'Validation error', 400);
    }

    const { limit, offset, page } = queryValue;
    const actualOffset = page ? (page - 1) * limit : offset;

    const result = await this.interactionService.getInteractionsByUser(userId, limit, actualOffset);

    res.status(200).json({
      success: true,
      message: 'User interactions retrieved successfully',
      data: result.interactions,
      pagination: {
        total: result.total,
        page: result.page,
        limit,
        totalPages: result.totalPages,
      },
    });
  });

  /**
   * Get interactions by article ID
   * GET /api/v1/interactions/article/:articleId
   */
  getInteractionsByArticle = asyncHandler(async (req: Request, res: Response) => {
    const { error, value: articleId } = objectIdSchema.validate(req.params.articleId);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const { interactionType } = req.query;
    const validInteractionType = interactionType === 'view' || interactionType === 'like' 
      ? interactionType as 'view' | 'like' 
      : undefined;

    const result = await this.interactionService.getInteractionsByArticle(articleId, validInteractionType);

    res.status(200).json({
      success: true,
      message: 'Article interactions retrieved successfully',
      data: result.interactions,
      stats: {
        total: result.total,
        views: result.views,
        likes: result.likes,
      },
    });
  });

  /**
   * Get interaction statistics for an article
   * GET /api/v1/interactions/stats/:articleId
   */
  getInteractionStats = asyncHandler(async (req: Request, res: Response) => {
    const { error, value: articleId } = objectIdSchema.validate(req.params.articleId);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const stats = await this.interactionService.getInteractionStats(articleId);

    res.status(200).json({
      success: true,
      message: 'Interaction statistics retrieved successfully',
      data: stats,
    });
  });

  /**
   * Remove an interaction
   * DELETE /api/v1/interactions
   */
  removeInteraction = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = createInteractionSchema.validate(req.body);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const { userId, articleId, interactionType } = value;
    const removed = await this.interactionService.removeInteraction(userId, articleId, interactionType);

    if (!removed) {
      throw createError('Interaction not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Interaction removed successfully',
    });
  });

  /**
   * Check if user has specific interaction with article
   * GET /api/v1/interactions/check
   */
  checkInteraction = asyncHandler(async (req: Request, res: Response) => {
    const { userId, articleId, interactionType } = req.query;

    if (!userId || !articleId || !interactionType) {
      throw createError('userId, articleId, and interactionType are required', 400);
    }

    const { error: userIdError } = objectIdSchema.validate(userId);
    if (userIdError) {
      throw createError('Invalid userId format', 400);
    }

    const { error: articleIdError } = objectIdSchema.validate(articleId);
    if (articleIdError) {
      throw createError('Invalid articleId format', 400);
    }

    if (interactionType !== 'view' && interactionType !== 'like') {
      throw createError('interactionType must be either "view" or "like"', 400);
    }

    const hasInteraction = await this.interactionService.hasInteraction(
      userId as string,
      articleId as string,
      interactionType as 'view' | 'like'
    );

    res.status(200).json({
      success: true,
      message: 'Interaction check completed',
      data: {
        hasInteraction,
        userId,
        articleId,
        interactionType,
      },
    });
  });

  /**
   * Get all interactions (admin function)
   * GET /api/v1/interactions
   */
  getAllInteractions = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const { limit, offset, page } = value;
    const actualOffset = page ? (page - 1) * limit : offset;

    const result = await this.interactionService.getAllInteractions(limit, actualOffset);

    res.status(200).json({
      success: true,
      message: 'All interactions retrieved successfully',
      data: result.interactions,
      pagination: {
        total: result.total,
        page: result.page,
        limit,
        totalPages: result.totalPages,
      },
    });
  });
}