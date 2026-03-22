import { Request } from 'express';
import { BadRequestError, UnauthorizedError } from './appError';

export const requireAuthenticatedUserId = (req: Request): number => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  return userId;
};

export const parseIdParam = (rawId: string, resourceName: string): number => {
  const parsedId = Number.parseInt(rawId, 10);

  if (Number.isNaN(parsedId)) {
    throw new BadRequestError(`Invalid ${resourceName} ID`);
  }

  return parsedId;
};

export const parseOptionalPositiveIntQueryParam = (
  value: unknown,
  paramName: string,
): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const rawValue = String(value).trim();
  const parsedValue = Number.parseInt(rawValue, 10);

  if (rawValue.length === 0 || Number.isNaN(parsedValue) || parsedValue <= 0) {
    throw new BadRequestError(
      `Query parameter '${paramName}' must be a positive integer.`,
    );
  }

  return parsedValue;
};
