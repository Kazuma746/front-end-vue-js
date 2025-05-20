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
  Title: string;
  Content: string;
  PostedAt: string;
  CreatedAt: string;
  UpdatedAt: string;
  PublishedAt: string;
  Category: string;
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