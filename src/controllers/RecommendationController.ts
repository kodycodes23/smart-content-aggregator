import { Request, Response } from 'express';
import { RecommendationService } from '../services';
import { objectIdSchema, paginationSchema } from '../middleware/validation';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class RecommendationController {
  private recommendationService: RecommendationService;

  constructor() {
    this.recommendationService = new RecommendationService();
  }

  /**
   * Get article recommendations for a user
   * GET /api/v1/recommendations/:userId
   */
  getRecommendationsForUser = asyncHandler(async (req: Request, res: Response) => {
    const { error: paramError, value: userId } = objectIdSchema.validate(req.params.userId);
    if (paramError) {
      throw createError(paramError.details?.[0]?.message || 'Validation error', 400);
    }

    // Parse limit from query parameters
    const limit = parseInt(req.query.limit as string) || 10;
    if (limit < 1 || limit > 50) {
      throw createError('Limit must be between 1 and 50', 400);
    }

    const recommendations = await this.recommendationService.getRecommendationsForUser(
      userId,
      limit
    );

    res.status(200).json({
      success: true,
      message: 'Recommendations generated successfully',
      data: recommendations.recommendations,
      user: recommendations.user,
      metadata: recommendations.metadata,
      pagination: {
        total: recommendations.total,
        limit,
        returned: recommendations.recommendations.length,
      },
    });
  });

  /**
   * Get trending articles
   * GET /api/v1/recommendations/trending
   */
  getTrendingArticles = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    if (limit < 1 || limit > 50) {
      throw createError('Limit must be between 1 and 50', 400);
    }

    const trendingArticles = await this.recommendationService.getTrendingArticles(limit);

    res.status(200).json({
      success: true,
      message: 'Trending articles retrieved successfully',
      data: trendingArticles,
      pagination: {
        total: trendingArticles.length,
        limit,
        returned: trendingArticles.length,
      },
    });
  });

  /**
   * Get recommendation algorithm info
   * GET /api/v1/recommendations/info
   */
  getRecommendationInfo = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Recommendation algorithm information',
      data: {
        algorithm: 'rule-based-v1',
        version: '1.0.0',
        description: 'Simple rule-based recommendation system',
        features: [
          'Interest-based matching (60% weight)',
          'Popularity-based recommendations (40% weight)',
          'Excludes already viewed articles',
          'Trending articles support',
        ],
        scoring: {
          interestBased: {
            titleMatch: 3,
            summaryMatch: 2,
            contentMatch: 1,
            multipleInterestsBonus: 0.5,
          },
          popularityBased: {
            likesWeight: 2,
            viewsWeight: 1,
          },
        },
        limits: {
          maxRecommendations: 50,
          defaultRecommendations: 10,
        },
      },
    });
  });
}