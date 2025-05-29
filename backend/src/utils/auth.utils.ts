import { Request } from 'express';
import { LoginCredentials } from '../types/auth.types';

export const extractBasicAuthCredentials = (
  req: Request,
): LoginCredentials | null => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );
    const [email, password] = credentials.split(':');

    if (!email || !password) {
      return null;
    }

    return { email, password };
  } catch (error) {
    return null;
  }
};
