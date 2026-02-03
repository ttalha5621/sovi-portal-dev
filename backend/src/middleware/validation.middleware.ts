import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, body, param, query } from 'express-validator';
import { formatErrorResponse } from '../utils/helpers';

// Validation for user registration
export const validateRegister = [
    body('email')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[a-zA-Z]/).withMessage('Password must contain a letter'),
    body('name')
        .optional()
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
        .trim(),
    body('role')
        .optional()
        .isIn(['ADMIN', 'USER']).withMessage('Role must be either ADMIN or USER')
];

// Validation for user login
export const validateLogin = [
    body('email')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Validation for district creation
export const validateDistrictCreate = [
    body('name')
        .notEmpty().withMessage('District name is required')
        .isLength({ max: 100 }).withMessage('District name must be less than 100 characters')
        .trim(),
    body('fid')
        .optional()
        .isString().withMessage('FID must be a string')
        .trim(),
    body('division')
        .optional()
        .isString().withMessage('Division must be a string')
        .isLength({ max: 50 }).withMessage('Division must be less than 50 characters')
        .trim(),
    body('province')
        .optional()
        .isString().withMessage('Province must be a string')
        .isLength({ max: 50 }).withMessage('Province must be less than 50 characters')
        .trim(),
    body('country')
        .optional()
        .isString().withMessage('Country must be a string')
        .default('Pakistan')
        .trim()
];

// Validation for district update
export const validateDistrictUpdate = [
    param('id')
        .isInt().withMessage('District ID must be an integer'),
    body('name')
        .optional()
        .isLength({ min: 1, max: 100 }).withMessage('District name must be between 1 and 100 characters')
        .trim(),
    body('fid')
        .optional()
        .isString().withMessage('FID must be a string')
        .trim(),
    body('division')
        .optional()
        .isString().withMessage('Division must be a string')
        .isLength({ max: 50 }).withMessage('Division must be less than 50 characters')
        .trim(),
    body('province')
        .optional()
        .isString().withMessage('Province must be a string')
        .isLength({ max: 50 }).withMessage('Province must be less than 50 characters')
        .trim(),
    body('country')
        .optional()
        .isString().withMessage('Country must be a string')
        .trim()
];

// Validation for SoVI data
export const validateSoviData = [
    body('districtId')
        .isInt().withMessage('District ID must be an integer'),
    body('year')
        .isInt({ min: 2000, max: 2100 }).withMessage('Year must be between 2000 and 2100'),
    // Education fields
    body('NOSCL').optional().isFloat({ min: 0, max: 100 }).withMessage('NOSCL must be between 0 and 100'),
    body('PRIMSC').optional().isFloat({ min: 0, max: 100 }).withMessage('PRIMSC must be between 0 and 100'),
    body('ENRLPR').optional().isFloat({ min: 0, max: 100 }).withMessage('ENRLPR must be between 0 and 100'),
    body('ENRMA').optional().isFloat({ min: 0, max: 100 }).withMessage('ENRMA must be between 0 and 100'),
    body('PATS').optional().isFloat({ min: 0, max: 100 }).withMessage('PATS must be between 0 and 100'),
    body('ADLLIT').optional().isFloat({ min: 0, max: 100 }).withMessage('ADLLIT must be between 0 and 100'),
    // Health fields
    body('DIARR').optional().isFloat({ min: 0, max: 100 }).withMessage('DIARR must be between 0 and 100'),
    body('IMMUN').optional().isFloat({ min: 0, max: 100 }).withMessage('IMMUN must be between 0 and 100'),
    body('WTTI').optional().isFloat({ min: 0, max: 100 }).withMessage('WTTI must be between 0 and 100'),
    body('CbyladyH_W_PRE').optional().isFloat({ min: 0, max: 100 }).withMessage('CbyladyH_W_PRE must be between 0 and 100'),
    body('CbyladyH_W_POST').optional().isFloat({ min: 0, max: 100 }).withMessage('CbyladyH_W_POST must be between 0 and 100'),
    body('PNCONSL').optional().isFloat({ min: 0, max: 100 }).withMessage('PNCONSL must be between 0 and 100'),
    body('FERTILITY').optional().isFloat({ min: 0, max: 10 }).withMessage('FERTILITY must be between 0 and 10'),
    body('CHDISABL').optional().isFloat({ min: 0, max: 100 }).withMessage('CHDISABL must be between 0 and 100'),
    // Facility fields
    body('TENURE').optional().isFloat({ min: 0, max: 100 }).withMessage('TENURE must be between 0 and 100'),
    body('ROOMS').optional().isFloat({ min: 0, max: 10 }).withMessage('ROOMS must be between 0 and 10'),
    body('ELECTRIC').optional().isFloat({ min: 0, max: 100 }).withMessage('ELECTRIC must be between 0 and 100'),
    body('TAPWATER').optional().isFloat({ min: 0, max: 100 }).withMessage('TAPWATER must be between 0 and 100'),
    body('MEDIA').optional().isFloat({ min: 0, max: 100 }).withMessage('MEDIA must be between 0 and 100'),
    body('INTERNET').optional().isFloat({ min: 0, max: 100 }).withMessage('INTERNET must be between 0 and 100'),
    // Economic fields
    body('QAGRI').optional().isFloat({ min: 0, max: 100 }).withMessage('QAGRI must be between 0 and 100'),
    body('REMITT').optional().isFloat({ min: 0, max: 100 }).withMessage('REMITT must be between 0 and 100'),
    body('ECoH').optional().isFloat({ min: 0, max: 100 }).withMessage('ECoH must be between 0 and 100'),
    body('BHU_F').optional().isFloat({ min: 0, max: 100 }).withMessage('BHU_F must be between 0 and 100'),
    body('Fmly_P').optional().isFloat({ min: 0, max: 100 }).withMessage('Fmly_P must be between 0 and 100'),
    body('Sch_F').optional().isFloat({ min: 0, max: 100 }).withMessage('Sch_F must be between 0 and 100'),
    body('Vat_F').optional().isFloat({ min: 0, max: 100 }).withMessage('Vat_F must be between 0 and 100'),
    body('Agro_F').optional().isFloat({ min: 0, max: 100 }).withMessage('Agro_F must be between 0 and 100'),
    body('Pol_F').optional().isFloat({ min: 0, max: 100 }).withMessage('Pol_F must be between 0 and 100'),
    // Population fields
    body('QOLD').optional().isFloat({ min: 0, max: 100 }).withMessage('QOLD must be between 0 and 100'),
    body('QMID').optional().isFloat({ min: 0, max: 100 }).withMessage('QMID must be between 0 and 100'),
    body('Fpop').optional().isFloat({ min: 0, max: 100 }).withMessage('Fpop must be between 0 and 100'),
    body('Rpop').optional().isFloat({ min: 0, max: 100 }).withMessage('Rpop must be between 0 and 100'),
    body('Upop').optional().isFloat({ min: 0, max: 100 }).withMessage('Upop must be between 0 and 100'),
    body('QKIDS').optional().isFloat({ min: 0, max: 100 }).withMessage('QKIDS must be between 0 and 100'),
    body('Growth_Rate').optional().isFloat({ min: -10, max: 10 }).withMessage('Growth_Rate must be between -10 and 10')
];

// Validation for pagination
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
        .toInt()
];

// Validation for search
export const validateSearch = [
    query('q')
        .notEmpty().withMessage('Search query is required')
        .isString().withMessage('Search query must be a string')
        .isLength({ min: 2 }).withMessage('Search query must be at least 2 characters long')
        .trim()
];

// Middleware to check validation results
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json(formatErrorResponse('Validation failed', errorMessages));
    }
    next();
};