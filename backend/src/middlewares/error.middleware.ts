import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '@/helpers/error';

export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    // Check if it's specifically about interests
    if (err.message.includes('interests')) {
      err = new ErrorHandler(
        400,
        'Some interests are not in your profile. Please update your interests in your profile first.',
      );
    } else {
      const errors = err.errors as Record<string, { message: string }>;
      err = new ErrorHandler(400, Object.values(errors)[0].message);
    }
  }

  // Handle other specific errors here...

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.data && { data: err.data }),
  });
};
