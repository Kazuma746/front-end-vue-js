import axios from 'axios';

const API_URL = 'http://127.0.0.1:1337/api';

// Utiliser la variable d'environnement STRAPI_API_TOKEN
const API_TOKEN = process.env.STRAPI_API_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}),
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
  try {
    // Structurer les données selon le format attendu par Strapi
    const formattedData = {
      data: {
        name: data.name,
        email: data.email,
        message_email: data.message // Assurez-vous que ce champ correspond au nom dans Strapi
      }
    };
    
    console.log('Données envoyées à Strapi:', formattedData);
    const response = await api.post('/messages', formattedData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
  }
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