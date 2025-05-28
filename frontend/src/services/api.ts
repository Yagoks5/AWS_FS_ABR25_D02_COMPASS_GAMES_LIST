import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const register = async (fullName: string, email: string, password: string) => {
  const response = await api.post('/register', { fullName, email, password });
  return response.data;
};

export default api;
