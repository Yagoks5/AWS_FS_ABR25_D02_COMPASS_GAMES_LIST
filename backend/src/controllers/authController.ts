import { NextFunction, Request, Response } from 'express';
import { authService } from '../services';
import { extractBasicAuthCredentials } from '../utils/auth.utils';
import { BadRequestError, UnauthorizedError } from '../utils/appError';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (
      !req.body ||
      !req.body.fullName ||
      !req.body.email ||
      !req.body.password ||
      !req.body.confirmPassword
    ) {
      throw new BadRequestError(
        'All fields are required: fullName, email, password, confirmPassword',
      );
    }

    const { fullName, email, password, confirmPassword } = req.body;

    const user = await authService.registerUser({
      fullName,
      email,
      password,
      confirmPassword,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    next(error);
    return;
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const credentials = extractBasicAuthCredentials(req);

    if (!credentials) {
      throw new UnauthorizedError(
        'Basic Authentication credentials are required',
      );
    }

    const { email, password } = credentials;
    const user = await authService.authenticateUser(email, password);

    res.status(200).json({
      success: true,
      message: 'User authenticated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
    return;
  }
};
