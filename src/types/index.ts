export interface IArticle {
  _id?: string;
  title: string;
  content: string;
  author: string;
  summary?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: string;
  username: string;
  interests?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInteraction {
  _id?: string;
  userId: string;
  articleId: string;
  interactionType: 'view' | 'like';
  createdAt?: Date;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}