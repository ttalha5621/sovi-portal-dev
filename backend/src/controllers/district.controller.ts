import { Request, Response } from 'express';
import districtService from '../services/district.service';
import { formatResponse, formatErrorResponse, getPaginationParams } from '../utils/helpers';
import logger from '../utils/logger';

export class DistrictController {
    async getAllDistricts(req: Request, res: Response) {
        try {
            const { page, limit } = getPaginationParams(req);

            const result = await districtService.getAllDistricts(page, limit);

            res.json(formatResponse(result, 'Districts retrieved successfully'));
        } catch (error: any) {
            logger.error('Get all districts controller error:', error);
            res.status(500).json(formatErrorResponse('Failed to retrieve districts'));
        }
    }

    async getDistrictById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const districtId = parseInt(id);

            if (isNaN(districtId)) {
                return res.status(400).json(formatErrorResponse('Invalid district ID'));
            }

            const district = await districtService.getDistrictById(districtId);

            if (!district) {
                return res.status(404).json(formatErrorResponse('District not found'));
            }

            res.json(formatResponse(district, 'District retrieved successfully'));
        } catch (error: any) {
            logger.error('Get district by ID controller error:', error);
            res.status(500).json(formatErrorResponse('Failed to retrieve district'));
        }
    }

    async createDistrict(req: Request, res: Response) {
        try {
            const { name, fid, division, province, country } = req.body;

            const district = await districtService.createDistrict({
                name,
                fid,
                division,
                province,
                country
            });

            res.status(201).json(formatResponse(district, 'District created successfully'));
        } catch (error: any) {
            logger.error('Create district controller error:', error);
            res.status(400).json(formatErrorResponse(error.message || 'Failed to create district'));
        }
    }

    async updateDistrict(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const districtId = parseInt(id);
            const updates = req.body;

            if (isNaN(districtId)) {
                return res.status(400).json(formatErrorResponse('Invalid district ID'));
            }

            const updatedDistrict = await districtService.updateDistrict(districtId, updates);

            res.json(formatResponse(updatedDistrict, 'District updated successfully'));
        } catch (error: any) {
            logger.error('Update district controller error:', error);
            res.status(400).json(formatErrorResponse(error.message || 'Failed to update district'));
        }
    }

    async deleteDistrict(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const districtId = parseInt(id);

            if (isNaN(districtId)) {
                return res.status(400).json(formatErrorResponse('Invalid district ID'));
            }

            const success = await districtService.deleteDistrict(districtId);

            if (!success) {
                return res.status(404).json(formatErrorResponse('District not found'));
            }

            res.json(formatResponse(null, 'District deleted successfully'));
        } catch (error: any) {
            logger.error('Delete district controller error:', error);
            res.status(400).json(formatErrorResponse(error.message || 'Failed to delete district'));
        }
    }

    async searchDistricts(req: Request, res: Response) {
        try {
            const { q } = req.query;
            const { page, limit } = getPaginationParams(req);

            if (!q || typeof q !== 'string') {
                return res.status(400).json(formatErrorResponse('Search query is required'));
            }

            const result = await districtService.searchDistricts(q, page, limit);

            res.json(formatResponse(result, 'Search results retrieved successfully'));
        } catch (error: any) {
            logger.error('Search districts controller error:', error);
            res.status(500).json(formatErrorResponse('Failed to search districts'));
        }
    }

    async getDistrictsByProvince(req: Request, res: Response) {
        try {
            const { province } = req.params;

            const districts = await districtService.getDistrictsByProvince(province);

            res.json(formatResponse(districts, `Districts in ${province} retrieved successfully`));
        } catch (error: any) {
            logger.error('Get districts by province controller error:', error);
            res.status(500).json(formatErrorResponse('Failed to retrieve districts by province'));
        }
    }

    async getDistrictsSummary(req: Request, res: Response) {
        try {
            const summary = await districtService.getDistrictsSummary();

            res.json(formatResponse(summary, 'Districts summary retrieved successfully'));
        } catch (error: any) {
            logger.error('Get districts summary controller error:', error);
            res.status(500).json(formatErrorResponse('Failed to retrieve districts summary'));
        }
    }
}

export default new DistrictController();