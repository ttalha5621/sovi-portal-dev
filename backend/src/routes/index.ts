import { Router } from 'express';
import authRoutes from './auth.routes';
import districtRoutes from './district.routes';
import soviRoutes from './sovi.routes';
import { notFoundHandler } from '../middleware/error.middleware';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/districts', districtRoutes);
router.use('/sovi', soviRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'SoVI API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: '1.0.0'
    });
});

// 404 handler for API routes
router.use('*', notFoundHandler);

export default router;