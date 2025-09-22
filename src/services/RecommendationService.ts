import { ArticleService, UserService, InteractionService } from './index';
import { IArticleDocument, IUserDocument } from '../models';
import { IArticle } from '../types';

export interface IRecommendation {
  article: IArticleDocument;
  score: number;
  reason: string;
  matchedInterests?: string[];
}

export interface IRecommendationResponse {
  recommendations: IRecommendation[];
  total: number;
  user: {
    id: string;
    username: string;
    interests: string[];
  };
  metadata: {
    interestBasedCount: number;
    popularityBasedCount: number;
    algorithm: string;
  };
}

export class RecommendationService {
  private articleService: ArticleService;
  private userService: UserService;
  private interactionService: InteractionService;

  constructor() {
    this.articleService = new ArticleService();
    this.userService = new UserService();
    this.interactionService = new InteractionService();
  }

  /**
   * Get article recommendations for a user
   * Uses a simple rule-based system with the following logic:
   * 1. Interest-based recommendations (60% weight)
   * 2. Popularity-based recommendations (40% weight)
   * 3. Excludes articles the user has already viewed
   */
  async getRecommendationsForUser(
    userId: string,
    limit: number = 10
  ): Promise<IRecommendationResponse> {
    try {
      // Get user details
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get user's viewed articles to exclude from recommendations
      const userInteractions = await this.interactionService.getInteractionsByUser(userId, 1000, 0);
      const viewedArticleIds = new Set(
        userInteractions.interactions
          .filter(interaction => interaction.interactionType === 'view')
          .map(interaction => interaction.articleId.toString())
      );

      // Get all articles
      const allArticles = await this.articleService.getArticles(1000, 0);
      
      // Filter out articles user has already viewed
      const unviewedArticles = allArticles.data.filter(
        article => !viewedArticleIds.has(article._id?.toString() || '')
      );

      // Generate recommendations
      const recommendations: IRecommendation[] = [];

      // 1. Interest-based recommendations (60% of results)
      const interestBasedLimit = Math.ceil(limit * 0.6);
      const interestRecommendations = await this.getInterestBasedRecommendations(
        user,
        unviewedArticles,
        interestBasedLimit
      );
      recommendations.push(...interestRecommendations);

      // 2. Popularity-based recommendations (40% of results)
      const popularityBasedLimit = limit - interestRecommendations.length;
      if (popularityBasedLimit > 0) {
        const excludeIds = new Set([
          ...Array.from(viewedArticleIds),
          ...recommendations.map(r => r.article._id?.toString() || '')
        ]);
        
        const popularityRecommendations = await this.getPopularityBasedRecommendations(
          unviewedArticles.filter(article => !excludeIds.has(article._id?.toString() || '')),
          popularityBasedLimit
        );
        recommendations.push(...popularityRecommendations);
      }

      // Sort by score (descending) and limit results
      const sortedRecommendations = recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return {
        recommendations: sortedRecommendations,
        total: sortedRecommendations.length,
        user: {
          id: user._id?.toString() || '',
          username: user.username,
          interests: user.interests || [],
        },
        metadata: {
          interestBasedCount: interestRecommendations.length,
          popularityBasedCount: recommendations.length - interestRecommendations.length,
          algorithm: 'rule-based-v1',
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate recommendations: ${error.message}`);
      }
      throw new Error('Failed to generate recommendations: Unknown error');
    }
  }

  /**
   * Generate interest-based recommendations
   * Matches articles based on user's interests (tags in title, content, or summary)
   */
  private async getInterestBasedRecommendations(
    user: IUserDocument,
    articles: IArticleDocument[],
    limit: number
  ): Promise<IRecommendation[]> {
    const recommendations: IRecommendation[] = [];
    const userInterests = user.interests || [];

    if (userInterests.length === 0) {
      return recommendations;
    }

    for (const article of articles) {
      const matchedInterests: string[] = [];
      let score = 0;

      // Check for interest matches in title, content, and summary
      const articleText = [
        article.title,
        article.content,
        article.summary || ''
      ].join(' ').toLowerCase();

      for (const interest of userInterests) {
        const interestLower = interest.toLowerCase();
        if (articleText.includes(interestLower)) {
          matchedInterests.push(interest);
          
          // Score based on where the match is found
          if (article.title.toLowerCase().includes(interestLower)) {
            score += 3; // Title match is most important
          }
          if (article.summary?.toLowerCase().includes(interestLower)) {
            score += 2; // Summary match is second most important
          }
          if (article.content.toLowerCase().includes(interestLower)) {
            score += 1; // Content match is least important
          }
        }
      }

      if (matchedInterests.length > 0) {
        // Boost score based on number of matched interests
        score += matchedInterests.length * 0.5;
        
        recommendations.push({
          article,
          score,
          reason: `Matches your interests: ${matchedInterests.join(', ')}`,
          matchedInterests,
        });
      }
    }

    // Sort by score and return top results
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Generate popularity-based recommendations
   * Recommends articles with the most interactions (views + likes)
   */
  private async getPopularityBasedRecommendations(
    articles: IArticleDocument[],
    limit: number
  ): Promise<IRecommendation[]> {
    const recommendations: IRecommendation[] = [];

    // Get interaction stats for all articles
    const articleStats = await Promise.all(
      articles.map(async (article) => {
        const stats = await this.interactionService.getInteractionStats(
          article._id?.toString() || ''
        );
        return {
          article,
          stats,
          popularityScore: stats.likes * 2 + stats.views, // Likes are weighted more than views
        };
      })
    );

    // Sort by popularity score and create recommendations
    const sortedByPopularity = articleStats
      .filter(item => item.popularityScore > 0) // Only include articles with interactions
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit);

    for (const item of sortedByPopularity) {
      const { article, stats, popularityScore } = item;
      
      let reason = 'Popular article';
      if (stats.likes > 0 && stats.views > 0) {
        reason = `Popular article (${stats.likes} likes, ${stats.views} views)`;
      } else if (stats.likes > 0) {
        reason = `Well-liked article (${stats.likes} likes)`;
      } else if (stats.views > 0) {
        reason = `Trending article (${stats.views} views)`;
      }

      recommendations.push({
        article,
        score: popularityScore * 0.1, // Normalize score to be lower than interest-based
        reason,
      });
    }

    return recommendations;
  }

  /**
   * Get trending articles (most interactions in recent time)
   * This can be used as a fallback when other recommendations are insufficient
   */
  async getTrendingArticles(limit: number = 5): Promise<IRecommendation[]> {
    try {
      // Get recent interactions (last 7 days worth of data simulation)
      const recentInteractions = await this.interactionService.getAllInteractions(1000, 0);
      
      // Count interactions per article
      const articleInteractionCount = new Map<string, { views: number; likes: number }>();
      
      for (const interaction of recentInteractions.interactions) {
        const articleId = interaction.articleId.toString();
        const current = articleInteractionCount.get(articleId) || { views: 0, likes: 0 };
        
        if (interaction.interactionType === 'view') {
          current.views++;
        } else if (interaction.interactionType === 'like') {
          current.likes++;
        }
        
        articleInteractionCount.set(articleId, current);
      }

      // Get articles and create trending recommendations
      const recommendations: IRecommendation[] = [];
      
      for (const [articleId, stats] of articleInteractionCount.entries()) {
        try {
          const article = await this.articleService.getArticleById(articleId);
          if (article) {
            const trendingScore = stats.likes * 3 + stats.views;
            recommendations.push({
              article,
              score: trendingScore,
              reason: `Trending now (${stats.likes} likes, ${stats.views} views)`,
            });
          }
        } catch (error) {
          // Skip articles that can't be found
          continue;
        }
      }

      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get trending articles: ${error.message}`);
      }
      throw new Error('Failed to get trending articles: Unknown error');
    }
  }
}