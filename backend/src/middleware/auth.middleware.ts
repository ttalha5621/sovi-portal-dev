import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authService from '../services/auth.service';
import { formatErrorResponse } from '../utils/helpers';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json(formatErrorResponse('Access token required'));
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;

        // Verify user still exists
        const user = await authService.getUserById(decoded.userId);
        if (!user) {
            return res.status(401).json(formatErrorResponse('Invalid token - user not found'));
        }

        (req as any).user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error: any) {
        logger.error('Authentication error:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(formatErrorResponse('Token expired'));
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json(formatErrorResponse('Invalid token'));
        }

        return res.status(500).json(formatErrorResponse('Authentication failed'));
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json(formatErrorResponse('Authentication required'));
        }

        if (user.role !== 'ADMIN') {
            return res.status(403).json(formatErrorResponse('Admin access required'));
        }

        next();
    } catch (error: any) {
        logger.error('Admin check error:', error);
        res.status(500).json(formatErrorResponse('Authorization check failed'));
    }
};

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json(formatErrorResponse('Authentication required'));
        }

        // Both USER and ADMIN roles can access
        if (user.role !== 'USER' && user.role !== 'ADMIN') {
            return res.status(403).json(formatErrorResponse('Access denied'));
        }

        next();
    } catch (error: any) {
        logger.error('User check error:', error);
        res.status(500).json(formatErrorResponse('Authorization check failed'));
    }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return next(); // No user, but that's okay for optional auth
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;

        // Verify user still exists
        const user = await authService.getUserById(decoded.userId);
        if (user) {
            (req as any).user = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
        }

        next();
    } catch (error) {
        // Token is invalid, but that's okay for optional auth
        next();
    }
};