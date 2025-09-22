import mongoose, { Schema, Document } from 'mongoose';
import { IInteraction } from '../types';

export interface IInteractionDocument extends Omit<IInteraction, '_id'>, Document {}

const InteractionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: [true, 'Article ID is required'],
    },
    interactionType: {
      type: String,
      required: [true, 'Interaction type is required'],
      enum: {
        values: ['view', 'like'],
        message: 'Interaction type must be either "view" or "like"',
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

// Add compound indexes for better query performance
InteractionSchema.index({ userId: 1, articleId: 1, interactionType: 1 });
InteractionSchema.index({ articleId: 1, interactionType: 1 });
InteractionSchema.index({ userId: 1, createdAt: -1 });
InteractionSchema.index({ createdAt: -1 });

// Ensure unique interactions per user per article per type
InteractionSchema.index(
  { userId: 1, articleId: 1, interactionType: 1 },
  { unique: true }
);

export const Interaction = mongoose.model<IInteractionDocument>('Interaction', InteractionSchema);