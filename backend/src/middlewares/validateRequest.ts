import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { ApiError } from '../utils/apiError';

export const validateRequest =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((err: ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ');
        next(new ApiError(400, `Validation Failed: ${errorMessage}`));
      } else {
        next(error);
      }
    }
  };
