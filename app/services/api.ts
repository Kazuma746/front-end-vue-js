import axios from 'axios';

const API_URL = 'http://127.0.0.1:1337/api';

// Utiliser la variable d'environnement API_TOKEN
const API_TOKEN = process.env.API_TOKEN || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`,
  },
});

export const getPosts = async () => {
  const response = await api.get('/posts?populate=*');
  return response.data;
};

export const getPost = async (id: string) => {
  const response = await api.get(`/posts/${id}?populate=*`);
  return response.data;
};

export const submitContactForm = async (data: { name: string; email: string; message: string }) => {
  const response = await api.post('/messages', { data });
  return response.data;
};

// Fonctions d'authentification
export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/local/register', {
    username,
    email,
    password,
  });
  return response.data;
};

export const login = async (identifier: string, password: string) => {
  const response = await api.post('/auth/local', {
    identifier,
    password,
  });
  return response.data;
};

export const getMe = async (token: string) => {
  const response = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}; 