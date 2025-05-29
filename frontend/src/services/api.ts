import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // ou  se estiver testando localmente
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;

