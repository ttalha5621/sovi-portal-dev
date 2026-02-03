import { Request, Response } from 'express';
import soviService from '../services/sovi.service';
import calculationService from '../services/calculation.service';
import { formatResponse, formatErrorResponse, getYearParam } from '../utils/helpers';
import logger from '../utils/logger';

export class SoviController {
    async getDistrictData(req: Request, res: Response) {
        try {
            const { districtId } = req.params;
            const year = getYearParam(req);
            const id = parseInt(districtId);

            if (isNaN(id)) {
                return res.status(400).json(formatErrorResponse('Invalid district ID'));
            }

            const data = await soviService.getDistrictData(id, year);

            res.json(formatResponse(data, 'District data retrieved successfully'));
        } catch (error: any) {
            logger.error('Get district data controller error:', error);
            res.status(500).json(formatErrorResponse('Failed to retrieve district data'));
        }
    }

    async getLatestDistrictData(req: Request, res: Response) {
        try {
            const { districtId } = req.params;
            const id = parseInt(districtId);

            if (isNaN(id)) {
                return res.status(400).json(formatErrorResponse('Invalid district ID'));
            }

            const data = await soviService.getLatestDistrictData(id);

            if (!data) {
                return res.status(404).json(formatErrorResponse('No data found for this district'));
            }

            res.json(formatResponse(data, 'Latest district data retrieved successfully'));
        } catch (error: any) {
            logger.error('Get latest district data controller error:', error);
            res.status(500).json(formatErrorResponse('Failed to retrieve latest district data'));
        }
    }

    async createOrUpdateDistrictData(req: Request, res: Response) {
        try {
            const data = req.body;

            const result = await soviService.createOrUpdateDistrictData(data);

            res.status(201).json(formatResponse(result, 'District data saved successfully'));
        } catch (error: any) {
            logger.error('Create/update district data controller error:', error);
            res.status(400).json(formatErrorResponse(error.message || 'Failed to save district data'));
        }
    }

    async deleteDistrictData(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const dataId = parseInt(id);

            if (isNaN(dataId)) {
                return res.status(400).json(formatErrorResponse('Invalid data ID'));
            }

            const success = await soviService.deleteDistrictData(dataId);

            if (!success) {
                return res.status(404).json(formatErrorResponse('District data not found'));
            }

            res.json(formatResponse(null, 'District data deleted successfully'));
        } catch (error: any) {
            logger.error('Delete district data controller error:', error);
            res.status(400).json(formatErrorResponse(error.message || 'Failed to delete district data'));
        }
    }

    async getMapData(req: Request, res: Response) {
        try {
            const data = await soviService.getMapData();

            res.json(formatResponse(data, 'Map data retrieved successfully'));
        } catch (error: any) {
            logger.error('Get map data controller error:', error);
            res.status(500).json(formatErrorResponse('Failed to retrieve map data'));
        }
    }

    async calculateScore(req: Request, res: Response) {
        try {
            const data = req.body;

            const scores = calculationService.calculateAllScores(data);

            res.json(formatResponse(scores, 'Score calculated successfully'));
        } catch (error: any) {
            logger.error('Calculate score controller error:', error);
            res.status(400).json(formatErrorResponse('Failed to calculate score'));
        }
    }

    async getYearlyTrends(req: Request, res: Response) {
        try {
            const { districtId } = req.params;
            const id = parseInt(districtId);

            if (isNaN(id)) {
                return res.status(400).json(formatErrorResponse('Invalid district ID'));
            }

            const trends = await soviService.getYearlyTrends(id);

            res.json(formatResponse(trends, 'Yearly trends retrieved successfully'));
        } catch (error: any) {
            logger.error('Get yearly trends controller error:', error);
            res.status(500).json(formatErrorResponse('Failed to retrieve yearly trends'));
        }
    }

    async getComparativeAnalysis(req: Request, res: Response) {
        try {
            const { districtId } = req.params;
            const id = parseInt(districtId);

            if (isNaN(id)) {
                return res.status(400).json(formatErrorResponse('Invalid district ID'));
            }

            const analysis = await soviService.getComparativeAnalysis(id);

            res.json(formatResponse(analysis, 'Comparative analysis retrieved successfully'));
        } catch (error: any) {
            logger.error('Get comparative analysis controller error:', error);
            res.status(500).json(formatErrorResponse('Failed to retrieve comparative analysis'));
        }
    }

    async bulkUpdateDistrictData(req: Request, res: Response) {
        try {
            const data = req.body;

            if (!Array.isArray(data)) {
                return res.status(400).json(formatErrorResponse('Data must be an array'));
            }

            const result = await soviService.bulkUpdateDistrictData(data);

            res.json(formatResponse(result, 'Bulk update completed successfully'));
        } catch (error: any) {
            logger.error('Bulk update district data controller error:', error);
            res.status(400).json(formatErrorResponse('Failed to perform bulk update'));
        }
    }

    async validateScoreImprovement(req: Request, res: Response) {
        try {
            const { currentData, newData } = req.body;

            if (!currentData || !newData) {
                return res.status(400).json(formatErrorResponse('Both currentData and newData are required'));
            }

            const validation = calculationService.validateScoreImprovement(currentData, newData);

            res.json(formatResponse(validation, 'Score improvement validation completed'));
        } catch (error: any) {
            logger.error('Validate score improvement controller error:', error);
            res.status(400).json(formatErrorResponse('Failed to validate score improvement'));
        }
    }
}

export default new SoviController();