import { Request, Response } from 'express';
import { UserService } from '../services';
import { createUserSchema, updateUserSchema, paginationSchema, objectIdSchema } from '../middleware/validation';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Create a new user
   * POST /api/v1/users
   */
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const user = await this.userService.createUser(value);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  });

  /**
   * Get all users with pagination
   * GET /api/v1/users
   */
  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const { limit, offset, page } = value;
    const actualOffset = page ? (page - 1) * limit : offset;

    const result = await this.userService.getUsers(limit, actualOffset);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.users,
      pagination: {
        total: result.total,
        page: result.page,
        limit,
        totalPages: result.totalPages,
      },
    });
  });

  /**
   * Get single user by ID
   * GET /api/v1/users/:id
   */
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = objectIdSchema.validate(req.params.id);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const user = await this.userService.getUserById(value);
    if (!user) {
      throw createError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  });

  /**
   * Get user by username
   * GET /api/v1/users/username/:username
   */
  getUserByUsername = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    if (!username || username.trim().length === 0) {
      throw createError('Username is required', 400);
    }

    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw createError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  });

  /**
   * Update user by ID
   * PUT /api/v1/users/:id
   */
  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { error: paramError, value: paramValue } = objectIdSchema.validate(req.params.id);
    if (paramError) {
      throw createError(paramError.details?.[0]?.message || 'Validation error', 400);
    }

    const { error: bodyError, value: bodyValue } = updateUserSchema.validate(req.body);
    if (bodyError) {
      throw createError(bodyError.details?.[0]?.message || 'Validation error', 400);
    }

    const user = await this.userService.updateUser(paramValue, bodyValue);
    if (!user) {
      throw createError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  });

  /**
   * Delete user by ID
   * DELETE /api/v1/users/:id
   */
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = objectIdSchema.validate(req.params.id);
    if (error) {
      throw createError(error.details?.[0]?.message || 'Validation error', 400);
    }

    const deleted = await this.userService.deleteUser(value);
    if (!deleted) {
      throw createError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  });

  /**
   * Check if username exists
   * GET /api/v1/users/check/:username
   */
  checkUsername = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    if (!username || username.trim().length === 0) {
      throw createError('Username is required', 400);
    }

    const exists = await this.userService.usernameExists(username);

    res.status(200).json({
      success: true,
      message: 'Username check completed',
      data: {
        username,
        exists,
        available: !exists,
      },
    });
  });
}