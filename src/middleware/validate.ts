import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware to validate the request body using a Zod schema.
 * - Parses and validates `req.body` against the provided schema.
 * - If validation fails, responds with HTTP 400 and detailed error messages.
 * - If validation passes, replaces `req.body` with the parsed and typed data.
 * - Calls `next()` to proceed to the next middleware or route handler.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: result.error.format(),
      });
      return;
    }

    req.body = result.data;
    next();
  };
}
