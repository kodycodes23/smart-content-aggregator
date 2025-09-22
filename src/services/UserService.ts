import { User, IUserDocument } from '../models';
import { IUser } from '../types';

export class UserService {
  
  /**
   * Create a new user
   */
  async createUser(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUserDocument> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('duplicate key error') || error.message.includes('E11000')) {
          throw new Error('Username already exists');
        }
        throw new Error(`Failed to create user: ${error.message}`);
      }
      throw new Error('Failed to create user: Unknown error');
    }
  }

  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<IUserDocument | null> {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve user: ${error.message}`);
      }
      throw new Error('Failed to retrieve user: Unknown error');
    }
  }

  /**
   * Get a user by username
   */
  async getUserByUsername(username: string): Promise<IUserDocument | null> {
    try {
      const user = await User.findOne({ username: username.toLowerCase() });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve user: ${error.message}`);
      }
      throw new Error('Failed to retrieve user: Unknown error');
    }
  }

  /**
   * Update a user by ID
   */
  async updateUser(
    id: string,
    updateData: Partial<Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>>
  ): Promise<IUserDocument | null> {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      return user;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('duplicate key error') || error.message.includes('E11000')) {
          throw new Error('Username already exists');
        }
        throw new Error(`Failed to update user: ${error.message}`);
      }
      throw new Error('Failed to update user: Unknown error');
    }
  }

  /**
   * Delete a user by ID
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }
      throw new Error('Failed to delete user: Unknown error');
    }
  }

  /**
   * Get all users (with pagination)
   */
  async getUsers(limit: number = 20, offset: number = 0): Promise<{
    users: IUserDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const page = Math.floor(offset / limit) + 1;
      
      const [users, total] = await Promise.all([
        User.find()
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean(),
        User.countDocuments()
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        users: users as IUserDocument[],
        total,
        page,
        totalPages,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve users: ${error.message}`);
      }
      throw new Error('Failed to retrieve users: Unknown error');
    }
  }

  /**
   * Check if username exists
   */
  async usernameExists(username: string): Promise<boolean> {
    try {
      const user = await User.findOne({ username: username.toLowerCase() });
      return !!user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to check username: ${error.message}`);
      }
      throw new Error('Failed to check username: Unknown error');
    }
  }
}