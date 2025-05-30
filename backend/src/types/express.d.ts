import { User } from './user.types';

declare global {
  namespace Express {
    interface Request {
      user?: User; // Optional user object for authenticated requests
      sessionId?: string; // Optional session ID for tracking sessions
    }
  }
}

export {};
