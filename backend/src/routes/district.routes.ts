import { Router } from 'express';
import districtController from '../controllers/district.controller';
import {
    authenticateToken,
    requireAdmin,
    requireUser,
    optionalAuth
} from '../middleware/auth.middleware';
import {
    validateDistrictCreate,
    validateDistrictUpdate,
    validatePagination,
    validateSearch,
    validate
} from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

// Public routes
router.get('/', optionalAuth, validatePagination, validate, asyncHandler(districtController.getAllDistricts));
router.get('/summary', optionalAuth, asyncHandler(districtController.getDistrictsSummary));
router.get('/search', optionalAuth, validateSearch, validate, asyncHandler(districtController.searchDistricts));
router.get('/province/:province', optionalAuth, asyncHandler(districtController.getDistrictsByProvince));
router.get('/:id', optionalAuth, asyncHandler(districtController.getDistrictById));

// Protected routes (Admin only)
router.post('/', authenticateToken, requireAdmin, validateDistrictCreate, validate, asyncHandler(districtController.createDistrict));
router.put('/:id', authenticateToken, requireAdmin, validateDistrictUpdate, validate, asyncHandler(districtController.updateDistrict));
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(districtController.deleteDistrict));

export default router;