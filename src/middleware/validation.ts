import Joi from 'joi';

// Article validation schemas
export const createArticleSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title cannot exceed 200 characters',
  }),
  content: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Content is required',
  }),
  author: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Author is required',
    'string.max': 'Author cannot exceed 100 characters',
  }),
  summary: Joi.string().trim().max(500).allow(null, '').optional().messages({
    'string.max': 'Summary cannot exceed 500 characters',
  }),
});

export const updateArticleSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  content: Joi.string().trim().min(1).optional(),
  author: Joi.string().trim().min(1).max(100).optional(),
  summary: Joi.string().trim().max(500).allow(null, '').optional(),
});

// User validation schemas
export const createUserSchema = Joi.object({
  username: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
    }),
  interests: Joi.array()
    .items(Joi.string().trim().min(1).max(50))
    .max(10)
    .optional()
    .default([])
    .messages({
      'array.max': 'Cannot have more than 10 interests',
    }),
});

export const updateUserSchema = Joi.object({
  username: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .optional(),
  interests: Joi.array()
    .items(Joi.string().trim().min(1).max(50))
    .max(10)
    .optional(),
});

// Interaction validation schemas
export const createInteractionSchema = Joi.object({
  userId: Joi.string().trim().required().messages({
    'string.empty': 'User ID is required',
  }),
  articleId: Joi.string().trim().required().messages({
    'string.empty': 'Article ID is required',
  }),
  interactionType: Joi.string().valid('view', 'like').required().messages({
    'any.only': 'Interaction type must be either "view" or "like"',
    'string.empty': 'Interaction type is required',
  }),
});

// Query parameter validation schemas
export const paginationSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
  offset: Joi.number().integer().min(0).default(0).optional(),
  page: Joi.number().integer().min(1).optional(),
});

export const articleQuerySchema = paginationSchema.keys({
  search: Joi.string().trim().min(1).optional(),
  author: Joi.string().trim().min(1).optional(),
});

// MongoDB ObjectId validation
export const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
  'string.pattern.base': 'Invalid ID format',
  'string.empty': 'ID is required',
});