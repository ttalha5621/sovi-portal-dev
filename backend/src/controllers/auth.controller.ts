import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { formatResponse, formatErrorResponse } from '../utils/helpers';
import logger from '../utils/logger';

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password, name, role } = req.body;

            const result = await authService.register({
                email,
                password,
                name,
                role
            });

            res.status(201).json(formatResponse(result, 'Registration successful'));
        } catch (error: any) {
            logger.error('Register controller error:', error);
            res.status(400).json(formatErrorResponse(error.message || 'Registration failed'));
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const result = await authService.login({
                email,
                password
            });

            res.json(formatResponse(result, 'Login successful'));
        } catch (error: any) {
            logger.error('Login controller error:', error);
            res.status(401).json(formatErrorResponse(error.message || 'Login failed'));
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.userId;

            if (!userId) {
                return res.status(401).json(formatErrorResponse('Unauthorized'));
            }

            const user = await authService.getUserById(userId);

            if (!user) {
                return res.status(404).json(formatErrorResponse('User not found'));
            }

            res.json(formatResponse(user, 'Profile retrieved successfully'));
        } catch (error: any) {
            logger.error('Get profile controller error:', error);
            res.status(500).json(formatErrorResponse('Failed to retrieve profile'));
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.userId;
            const updates = req.body;

            if (!userId) {
                return res.status(401).json(formatErrorResponse('Unauthorized'));
            }

            // Don't allow role changes through profile update
            if (updates.role) {
                delete updates.role;
            }

            const updatedUser = await authService.updateUser(userId, updates);

            if (!updatedUser) {
                return res.status(404).json(formatErrorResponse('User not found'));
            }

            res.json(formatResponse(updatedUser, 'Profile updated successfully'));
        } catch (error: any) {
            logger.error('Update profile controller error:', error);
            res.status(400).json(formatErrorResponse(error.message || 'Failed to update profile'));
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.userId;
            const { oldPassword, newPassword } = req.body;

            if (!userId) {
                return res.status(401).json(formatErrorResponse('Unauthorized'));
            }

            if (!oldPassword || !newPassword) {
                return res.status(400).json(formatErrorResponse('Old password and new password are required'));
            }

            const success = await authService.changePassword(userId, oldPassword, newPassword);

            if (!success) {
                return res.status(400).json(formatErrorResponse('Failed to change password'));
            }

            res.json(formatResponse(null, 'Password changed successfully'));
        } catch (error: any) {
            logger.error('Change password controller error:', error);
            res.status(400).json(formatErrorResponse(error.message || 'Failed to change password'));
        }
    }

    async verifyToken(req: Request, res: Response) {
        try {
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json(formatErrorResponse('Invalid token'));
            }

            const userData = await authService.getUserById(user.userId);

            if (!userData) {
                return res.status(404).json(formatErrorResponse('User not found'));
            }

            res.json(formatResponse({ user: userData, isValid: true }, 'Token is valid'));
        } catch (error: any) {
            logger.error('Verify token controller error:', error);
            res.status(401).json(formatErrorResponse('Invalid token'));
        }
    }
}

export default new AuthController();