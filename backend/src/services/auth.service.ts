import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import { RegisterRequest } from '../types/auth.types';
import { generateToken } from '../utils/jwt.utils';
import { User } from '../types/user.types';
import type { AuthResponse } from '../types/auth.types';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '../utils/validation.utils';

export class AuthService {
  private prisma = new PrismaClient();

  async registerUser(userData: RegisterRequest): Promise<User> {
    const { fullName, email, password, confirmPassword } = userData;

    const fullNameValidation = validateFullName(fullName);
    if (!fullNameValidation.isValid) {
      throw new Error(fullNameValidation.message);
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.message);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    const passwordConfirmationValidation = validatePasswordConfirmation(
      password,
      confirmPassword,
    );

    if (!passwordConfirmationValidation.isValid) {
      throw new Error(passwordConfirmationValidation.message);
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email, isDeleted: false },
    });

    if (existingUser) {
      throw new Error('User with this email already exists.');
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
      throw new Error('Email and password are required.');
    }

    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase().trim(), isDeleted: false },
    });    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
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
