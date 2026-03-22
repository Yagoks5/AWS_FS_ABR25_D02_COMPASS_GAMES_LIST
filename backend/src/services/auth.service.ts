import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { RegisterRequest } from '../types/auth.types';
import { generateToken } from '../utils/jwt.utils';
import { BadRequestError, UnauthorizedError } from '../utils/appError';
import { User } from '../types/user.types';
import type { AuthResponse } from '../types/auth.types';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '../utils/validation.utils';

export class AuthService {
  private prisma = prisma;

  async registerUser(userData: RegisterRequest): Promise<User> {
    const { fullName, email, password, confirmPassword } = userData;

    const fullNameValidation = validateFullName(fullName);
    if (!fullNameValidation.isValid) {
      throw new BadRequestError(
        fullNameValidation.message ?? 'Invalid full name.',
      );
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new BadRequestError(emailValidation.message ?? 'Invalid email.');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new BadRequestError(
        passwordValidation.message ?? 'Invalid password.',
      );
    }

    const passwordConfirmationValidation = validatePasswordConfirmation(
      password,
      confirmPassword,
    );

    if (!passwordConfirmationValidation.isValid) {
      throw new BadRequestError(
        passwordConfirmationValidation.message ??
          'Password confirmation does not match.',
      );
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email, isDeleted: false },
    });

    if (existingUser) {
      throw new BadRequestError('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    if (!email || !password) {
      throw new BadRequestError('Email and password are required.');
    }

    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase().trim(), isDeleted: false },
    });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };
  }
}
