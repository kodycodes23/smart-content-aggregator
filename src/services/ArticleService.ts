import { Article, IArticleDocument } from '../models';
import { IArticle, IPaginatedResponse } from '../types';

export class ArticleService {
  
  /**
   * Create a new article
   */
  async createArticle(articleData: Omit<IArticle, '_id' | 'createdAt' | 'updatedAt'>): Promise<IArticleDocument> {
    try {
      const article = new Article(articleData);
      return await article.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create article: ${error.message}`);
      }
      throw new Error('Failed to create article: Unknown error');
    }
  }

  /**
   * Get paginated list of articles
   */
  async getArticles(
    limit: number = 10,
    offset: number = 0
  ): Promise<IPaginatedResponse<IArticleDocument>> {
    try {
      const page = Math.floor(offset / limit) + 1;
      
      const [articles, total] = await Promise.all([
        Article.find()
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean(),
        Article.countDocuments()
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: articles as IArticleDocument[],
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve articles: ${error.message}`);
      }
      throw new Error('Failed to retrieve articles: Unknown error');
    }
  }

  /**
   * Get a single article by ID
   */
  async getArticleById(id: string): Promise<IArticleDocument | null> {
    try {
      const article = await Article.findById(id);
      return article;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve article: ${error.message}`);
      }
      throw new Error('Failed to retrieve article: Unknown error');
    }
  }

  /**
   * Update an article by ID
   */
  async updateArticle(
    id: string,
    updateData: Partial<Omit<IArticle, '_id' | 'createdAt' | 'updatedAt'>>
  ): Promise<IArticleDocument | null> {
    try {
      const article = await Article.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      return article;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update article: ${error.message}`);
      }
      throw new Error('Failed to update article: Unknown error');
    }
  }

  /**
   * Delete an article by ID
   */
  async deleteArticle(id: string): Promise<boolean> {
    try {
      const result = await Article.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete article: ${error.message}`);
      }
      throw new Error('Failed to delete article: Unknown error');
    }
  }

  /**
   * Search articles by text
   */
  async searchArticles(
    query: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<IPaginatedResponse<IArticleDocument>> {
    try {
      const page = Math.floor(offset / limit) + 1;
      
      const searchQuery = {
        $text: { $search: query }
      };

      const [articles, total] = await Promise.all([
        Article.find(searchQuery)
          .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean(),
        Article.countDocuments(searchQuery)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: articles as IArticleDocument[],
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search articles: ${error.message}`);
      }
      throw new Error('Failed to search articles: Unknown error');
    }
  }
}