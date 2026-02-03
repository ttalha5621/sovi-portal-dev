import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal server error';
    let errors: string[] = [];

    // Handle custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Handle validation errors
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
        errors = [err.message];
    }
    // Handle JWT errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    // Handle Prisma errors
    else if (err.name === 'PrismaClientKnownRequestError') {
        statusCode = 400;
        message = 'Database error';

        // Handle specific Prisma errors
        const prismaError = err as any;
        if (prismaError.code === 'P2002') {
            message = 'Duplicate entry - a record with this value already exists';
        } else if (prismaError.code === 'P2025') {
            message = 'Record not found';
        }
    }

    // Log error for debugging (except in production for client errors)
    if (statusCode >= 500) {
        logger.error('Server error:', {
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
            body: req.body,
            params: req.params,
            query: req.query
        });
    } else {
        logger.warn('Client error:', {
            message: err.message,
            path: req.path,
            method: req.method
        });
    }

    // Don't expose stack trace in production
    const response: any = {
        success: false,
        message,
        errors: errors.length > 0 ? errors : undefined
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404);
    next(error);
};

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};