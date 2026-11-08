import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors.js';
import { MoneyError } from '../money/money.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle explicit custom application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Handle core Money module errors cleanly
  if (err instanceof MoneyError) {
    res.status(400).json({
      error: 'MoneyError',
      code: err.code,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Fallback for unhandled internal server errors
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred on the server.',
  });
}