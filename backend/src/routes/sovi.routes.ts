import { Router } from 'express';
import soviController from '../controllers/sovi.controller';
import {
    authenticateToken,
    requireAdmin,
    requireUser,
    optionalAuth
} from '../middleware/auth.middleware';
import {
    validateSoviData,
    validatePagination,
    validate
} from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

// Public routes
router.get('/map-data', optionalAuth, asyncHandler(soviController.getMapData));
router.get('/district/:districtId', optionalAuth, asyncHandler(soviController.getDistrictData));
router.get('/district/:districtId/latest', optionalAuth, asyncHandler(soviController.getLatestDistrictData));
router.get('/district/:districtId/trends', optionalAuth, asyncHandler(soviController.getYearlyTrends));
router.get('/district/:districtId/compare', optionalAuth, asyncHandler(soviController.getComparativeAnalysis));
router.post('/calculate', optionalAuth, asyncHandler(soviController.calculateScore));

// Protected routes (User and Admin)
router.post('/district-data', authenticateToken, requireUser, validateSoviData, validate, asyncHandler(soviController.createOrUpdateDistrictData));
router.post('/validate-improvement', authenticateToken, requireUser, asyncHandler(soviController.validateScoreImprovement));

// Admin only routes
router.delete('/district-data/:id', authenticateToken, requireAdmin, asyncHandler(soviController.deleteDistrictData));
router.post('/bulk-update', authenticateToken, requireAdmin, asyncHandler(soviController.bulkUpdateDistrictData));

export default router;