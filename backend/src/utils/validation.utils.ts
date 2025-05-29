import { ValidationResult } from '../types/auth.types';

export const validateFullName = (fullName: string): ValidationResult => {
  if (!fullName || fullName.trim().length < 3) {
    return {
      isValid: false,
      message: 'Full name must be at least 3 characters long.',
    };
  }
  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return {
      isValid: false,
      message: 'Email is required.',
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Invalid email format.',
    };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required.',
    };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;

  if (!hasMinLength) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long.',
    };
  }

  if (!hasLetter) {
    return {
      isValid: false,
      message: 'Password must contain at least one letter.',
    };
  }

  if (!hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one number.',
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character.',
    };
  }

  return { isValid: true };
};

export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: 'Passwords do not match.',
    };
  }
  return { isValid: true };
};
