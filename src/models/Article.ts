import mongoose, { Schema, Document } from 'mongoose';
import { IArticle } from '../types';

export interface IArticleDocument extends Omit<IArticle, '_id'>, Document {}

const ArticleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    summary: {
      type: String,
      default: null,
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Add indexes for better query performance
ArticleSchema.index({ title: 'text', content: 'text', author: 'text' });
ArticleSchema.index({ createdAt: -1 });
ArticleSchema.index({ author: 1 });

export const Article = mongoose.model<IArticleDocument>('Article', ArticleSchema);