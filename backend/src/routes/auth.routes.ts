import { Router } from 'express';
import authController from '../controllers/auth.controller';
import {
    authenticateToken,
    requireUser
} from '../middleware/auth.middleware';
import {
    validateRegister,
    validateLogin,
    validate
} from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

// Public routes
router.post('/register', validateRegister, validate, asyncHandler(authController.register));
router.post('/login', validateLogin, validate, asyncHandler(authController.login));

// Protected routes
router.get('/profile', authenticateToken, requireUser, asyncHandler(authController.getProfile));
router.put('/profile', authenticateToken, requireUser, asyncHandler(authController.updateProfile));
router.post('/change-password', authenticateToken, requireUser, asyncHandler(authController.changePassword));
router.get('/verify', authenticateToken, asyncHandler(authController.verifyToken));

export default router;