import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { extractBasicAuthCredentials } from '../utils/auth.utils';

const authService = new AuthService();

export const register = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  if (
    !req.body ||
    !req.body.fullName ||
    !req.body.email ||
    !req.body.password ||
    !req.body.confirmPassword
  ) {
    return res.status(400).json({
      success: false,
      message:
        'All fields are required: fullName, email, password, confirmPassword',
    });
  }

  try {
    const { fullName, email, password, confirmPassword } = req.body;

    const user = await authService.registerUser({
      fullName,
      email,
      password,
      confirmPassword,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    console.error('Register error: ', error);

    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const credentials = extractBasicAuthCredentials(req);

    if (!credentials) {
      return res.status(401).json({
        success: false,
        message: 'Basic Authentication credentials are required',
      });
    }

    const { email, password } = credentials;
    const user = await authService.authenticateUser(email, password);

    return res.status(200).json({
      success: true,
      message: 'User authenticated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Login error: ', error);

    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
