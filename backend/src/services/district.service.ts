import prisma from '../config/database';
import { District, CreateDistrictInput, UpdateDistrictInput, DistrictWithData, DistrictListItem } from '../types/district.types';
import { validateDistrictInput, validateUpdateDistrictInput } from '../utils/validators';
import logger from '../utils/logger';
import { calculateOffset } from '../utils/helpers';

export class DistrictService {
    async getAllDistricts(page: number = 1, limit: number = 10): Promise<{ districts: DistrictListItem[]; total: number; pages: number }> {
        try {
            const offset = calculateOffset(page, limit);

            const [districts, total] = await Promise.all([
                prisma.district.findMany({
                    select: {
                        id: true,
                        name: true,
                        province: true,
                        soviScore: true,
                        rating: true,
                        country: true
                    },
                    orderBy: { name: 'asc' },
                    skip: offset,
                    take: limit
                }),
                prisma.district.count()
            ]);

            const pages = Math.ceil(total / limit);

            return {
                districts: districts as DistrictListItem[],
                total,
                pages
            };
        } catch (error) {
            logger.error('Get all districts error:', error);
            throw error;
        }
    }

    async getDistrictById(id: number): Promise<DistrictWithData | null> {
        try {
            const district = await prisma.district.findUnique({
                where: { id },
                include: {
                    data: {
                        orderBy: { year: 'desc' },
                        take: 5 // Get last 5 years of data
                    }
                }
            });

            return district;
        } catch (error) {
            logger.error(`Get district by ID error (ID: ${id}):`, error);
            throw error;
        }
    }

    async getDistrictByName(name: string): Promise<District | null> {
        try {
            const district = await prisma.district.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    }
                }
            });

            return district;
        } catch (error) {
            logger.error(`Get district by name error (Name: ${name}):`, error);
            throw error;
        }
    }

    async createDistrict(districtData: CreateDistrictInput): Promise<District> {
        try {
            // Validate input
            const validation = validateDistrictInput(districtData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Check if district already exists
            const existingDistrict = await this.getDistrictByName(districtData.name);
            if (existingDistrict) {
                throw new Error(`District '${districtData.name}' already exists`);
            }

            // Create district
            const district = await prisma.district.create({
                data: {
                    name: districtData.name,
                    fid: districtData.fid,
                    division: districtData.division,
                    province: districtData.province,
                    country: districtData.country || 'Pakistan'
                }
            });

            logger.info(`District created: ${district.name} (ID: ${district.id})`);

            return district;
        } catch (error) {
            logger.error('Create district error:', error);
            throw error;
        }
    }

    async updateDistrict(id: number, districtData: UpdateDistrictInput): Promise<District> {
        try {
            // Validate input
            const validation = validateUpdateDistrictInput(districtData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Check if district exists
            const existingDistrict = await prisma.district.findUnique({
                where: { id }
            });

            if (!existingDistrict) {
                throw new Error('District not found');
            }

            // Check if name change would cause conflict
            if (districtData.name && districtData.name !== existingDistrict.name) {
                const districtWithSameName = await this.getDistrictByName(districtData.name);
                if (districtWithSameName && districtWithSameName.id !== id) {
                    throw new Error(`District '${districtData.name}' already exists`);
                }
            }

            // Update district
            const updatedDistrict = await prisma.district.update({
                where: { id },
                data: districtData
            });

            logger.info(`District updated: ${updatedDistrict.name} (ID: ${updatedDistrict.id})`);

            return updatedDistrict;
        } catch (error) {
            logger.error(`Update district error (ID: ${id}):`, error);
            throw error;
        }
    }

    async deleteDistrict(id: number): Promise<boolean> {
        try {
            // Check if district exists
            const district = await prisma.district.findUnique({
                where: { id },
                include: { data: true }
            });

            if (!district) {
                throw new Error('District not found');
            }

            // Delete associated data first
            if (district.data.length > 0) {
                await prisma.districtData.deleteMany({
                    where: { districtId: id }
                });
            }

            // Delete district
            await prisma.district.delete({
                where: { id }
            });

            logger.info(`District deleted: ${district.name} (ID: ${id})`);

            return true;
        } catch (error) {
            logger.error(`Delete district error (ID: ${id}):`, error);
            throw error;
        }
    }

    async searchDistricts(query: string, page: number = 1, limit: number = 10): Promise<{ districts: DistrictListItem[]; total: number; pages: number }> {
        try {
            const offset = calculateOffset(page, limit);

            const [districts, total] = await Promise.all([
                prisma.district.findMany({
                    where: {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { province: { contains: query, mode: 'insensitive' } },
                            { division: { contains: query, mode: 'insensitive' } }
                        ]
                    },
                    select: {
                        id: true,
                        name: true,
                        province: true,
                        soviScore: true,
                        rating: true,
                        country: true
                    },
                    orderBy: { name: 'asc' },
                    skip: offset,
                    take: limit
                }),
                prisma.district.count({
                    where: {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { province: { contains: query, mode: 'insensitive' } },
                            { division: { contains: query, mode: 'insensitive' } }
                        ]
                    }
                })
            ]);

            const pages = Math.ceil(total / limit);

            return {
                districts: districts as DistrictListItem[],
                total,
                pages
            };
        } catch (error) {
            logger.error(`Search districts error (Query: ${query}):`, error);
            throw error;
        }
    }

    async getDistrictsByProvince(province: string): Promise<District[]> {
        try {
            const districts = await prisma.district.findMany({
                where: {
                    province: {
                        equals: province,
                        mode: 'insensitive'
                    }
                },
                orderBy: { name: 'asc' }
            });

            return districts;
        } catch (error) {
            logger.error(`Get districts by province error (Province: ${province}):`, error);
            throw error;
        }
    }

    async getDistrictsSummary(): Promise<{
        totalDistricts: number;
        byProvince: Record<string, number>;
        averageScore: number;
    }> {
        try {
            const [totalDistricts, districts] = await Promise.all([
                prisma.district.count(),
                prisma.district.findMany({
                    select: {
                        province: true,
                        soviScore: true
                    }
                })
            ]);

            // Group by province
            const byProvince: Record<string, number> = {};
            let totalScore = 0;
            let districtsWithScore = 0;

            districts.forEach((district: any) => {
                // Count by province
                const province = district.province || 'Unknown';
                byProvince[province] = (byProvince[province] || 0) + 1;

                // Calculate average score
                if (district.soviScore !== null) {
                    totalScore += district.soviScore;
                    districtsWithScore++;
                }
            });

            const averageScore = districtsWithScore > 0 ? totalScore / districtsWithScore : 0;

            return {
                totalDistricts,
                byProvince,
                averageScore: Number(averageScore.toFixed(2))
            };
        } catch (error) {
            logger.error('Get districts summary error:', error);
            throw error;
        }
    }
}

export default new DistrictService();