import 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: number;
        email: string;
      };
      session?: {
        id: string;
        expires: Date;
      };
    }
  }
}

export {};
