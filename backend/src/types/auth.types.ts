import { User } from './user.types';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export type AuthResponse = {
  user: {
    id: number;
    fullName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
};
