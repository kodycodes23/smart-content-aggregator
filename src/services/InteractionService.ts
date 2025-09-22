import { Interaction, IInteractionDocument } from '../models';
import { IInteraction } from '../types';

export class InteractionService {
  
  /**
   * Create or update an interaction
   */
  async createInteraction(interactionData: Omit<IInteraction, '_id' | 'createdAt'>): Promise<IInteractionDocument> {
    try {
      // Check if interaction already exists
      const existingInteraction = await Interaction.findOne({
        userId: interactionData.userId,
        articleId: interactionData.articleId,
        interactionType: interactionData.interactionType,
      });

      if (existingInteraction) {
        // Return existing interaction instead of creating duplicate
        return existingInteraction;
      }

      const interaction = new Interaction(interactionData);
      return await interaction.save();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('duplicate key error') || error.message.includes('E11000')) {
          // Handle duplicate interaction gracefully
          const existingInteraction = await Interaction.findOne({
            userId: interactionData.userId,
            articleId: interactionData.articleId,
            interactionType: interactionData.interactionType,
          });
          if (existingInteraction) {
            return existingInteraction;
          }
        }
        throw new Error(`Failed to create interaction: ${error.message}`);
      }
      throw new Error('Failed to create interaction: Unknown error');
    }
  }

  /**
   * Get interactions by user ID
   */
  async getInteractionsByUser(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{
    interactions: IInteractionDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const page = Math.floor(offset / limit) + 1;
      
      const [interactions, total] = await Promise.all([
        Interaction.find({ userId })
          .populate('articleId', 'title author summary')
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean(),
        Interaction.countDocuments({ userId })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        interactions: interactions as IInteractionDocument[],
        total,
        page,
        totalPages,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve user interactions: ${error.message}`);
      }
      throw new Error('Failed to retrieve user interactions: Unknown error');
    }
  }

  /**
   * Get interactions by article ID
   */
  async getInteractionsByArticle(
    articleId: string,
    interactionType?: 'view' | 'like'
  ): Promise<{
    interactions: IInteractionDocument[];
    total: number;
    views: number;
    likes: number;
  }> {
    try {
      const filter: any = { articleId };
      if (interactionType) {
        filter.interactionType = interactionType;
      }

      const [interactions, total, views, likes] = await Promise.all([
        Interaction.find(filter)
          .populate('userId', 'username')
          .sort({ createdAt: -1 })
          .lean(),
        Interaction.countDocuments(filter),
        Interaction.countDocuments({ articleId, interactionType: 'view' }),
        Interaction.countDocuments({ articleId, interactionType: 'like' })
      ]);

      return {
        interactions: interactions as IInteractionDocument[],
        total,
        views,
        likes,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve article interactions: ${error.message}`);
      }
      throw new Error('Failed to retrieve article interactions: Unknown error');
    }
  }

  /**
   * Get interaction statistics for an article
   */
  async getInteractionStats(articleId: string): Promise<{
    views: number;
    likes: number;
    totalInteractions: number;
  }> {
    try {
      const [views, likes, totalInteractions] = await Promise.all([
        Interaction.countDocuments({ articleId, interactionType: 'view' }),
        Interaction.countDocuments({ articleId, interactionType: 'like' }),
        Interaction.countDocuments({ articleId })
      ]);

      return {
        views,
        likes,
        totalInteractions,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve interaction statistics: ${error.message}`);
      }
      throw new Error('Failed to retrieve interaction statistics: Unknown error');
    }
  }

  /**
   * Remove an interaction
   */
  async removeInteraction(
    userId: string,
    articleId: string,
    interactionType: 'view' | 'like'
  ): Promise<boolean> {
    try {
      const result = await Interaction.findOneAndDelete({
        userId,
        articleId,
        interactionType,
      });
      return !!result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove interaction: ${error.message}`);
      }
      throw new Error('Failed to remove interaction: Unknown error');
    }
  }

  /**
   * Check if user has specific interaction with article
   */
  async hasInteraction(
    userId: string,
    articleId: string,
    interactionType: 'view' | 'like'
  ): Promise<boolean> {
    try {
      const interaction = await Interaction.findOne({
        userId,
        articleId,
        interactionType,
      });
      return !!interaction;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to check interaction: ${error.message}`);
      }
      throw new Error('Failed to check interaction: Unknown error');
    }
  }

  /**
   * Get all interactions (admin function)
   */
  async getAllInteractions(
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    interactions: IInteractionDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const page = Math.floor(offset / limit) + 1;
      
      const [interactions, total] = await Promise.all([
        Interaction.find()
          .populate('userId', 'username')
          .populate('articleId', 'title author')
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean(),
        Interaction.countDocuments()
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        interactions: interactions as IInteractionDocument[],
        total,
        page,
        totalPages,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve all interactions: ${error.message}`);
      }
      throw new Error('Failed to retrieve all interactions: Unknown error');
    }
  }
}