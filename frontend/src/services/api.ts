import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
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
  const credentials = btoa(`${email}:${password}`);

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
  confirmPassword: string,
) => {
  const response = await api.post('/auth/register', {
    fullName,
    email,
    password,
    confirmPassword,
  });
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

export const getPlatforms = async (page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page !== undefined) params.append('page', page.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  
  const response = await api.get(`/platforms?${params.toString()}`);
  return response.data;
};

export const getAllPlatforms = async () => {
  const response = await api.get('/platforms/all');
  return response.data;
};

export const createPlatform = async (platformData: {
  title: string;
  company: string;
  acquisitionYear: number;
  imageUrl?: string;
}) => {
  const response = await api.post('/platforms', platformData);
  return response.data;
};

export const updatePlatform = async (id: number, platformData: {
  title: string;
  company: string;
  acquisitionYear: number;
  imageUrl?: string;
}) => {
  const response = await api.put(`/platforms/${id}`, platformData);
  return response.data;
};

export const deletePlatform = async (id: number) => {
  const response = await api.delete(`/platforms/${id}`);
  return response.data;
};

export const getPlatformById = async (id: number) => {
  const response = await api.get(`/platforms/${id}`);
  return response.data;
};

export default api;
