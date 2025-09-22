import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: function(interests: string[]) {
          return interests.length <= 10;
        },
        message: 'Cannot have more than 10 interests',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Add indexes for better query performance
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ interests: 1 });
UserSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUserDocument>('User', UserSchema);