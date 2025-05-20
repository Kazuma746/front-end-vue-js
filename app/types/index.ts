export interface StrapiResponse<T> {
  data: StrapiData<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiData<T> {
  id: number;
  attributes: T;
}

export interface SingleStrapiResponse<T> {
  data: StrapiData<T>;
  meta: {};
}

export interface Post {
  title: string;
  content: string;
  postedAt: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  category?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
} 