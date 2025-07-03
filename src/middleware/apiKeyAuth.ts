import { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.API_KEY;

/**
 * Middleware to authenticate requests using an API key.
 * - Checks for the presence of 'x-api-key' header in the incoming request.
 * - Compares the provided key with the server's expected API key from environment variables.
 * - If missing or mismatched, responds with HTTP 401 Unauthorized.
 * - If valid, calls `next()` to proceed to the next middleware or route handler.
 */
export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers['x-api-key'];

  if (!key || key !== API_KEY) {
    res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
    return;
  }

  next();
}
