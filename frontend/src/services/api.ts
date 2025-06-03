import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // ou  se estiver testando localmente
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const login = async (email: string, password: string) => {
  const credentials = btoa(`${email}:${password}`); // codifica email:senha em base64

  const response = await api.post(
    '/auth/login',
    {},
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    },
  );

  return response.data;
};

export const register = async (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string, // corrigido
) => {
  const response = await api.post('/auth/register', {
    fullName,
    email,
    password,
    confirmPassword, // corrigido
  }); // corrigido
  return response.data;
};

export const getDashBoardData = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default api;
