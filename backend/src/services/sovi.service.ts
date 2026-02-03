import prisma from '../config/database';
import {
    DistrictData,
    CreateDistrictDataInput,
    UpdateDistrictDataInput,
    CalculatedScores,
    MapDistrictData
} from '../types/sovi.types';
import { calculateScores, validateSoVIData } from '../utils/calculateScores';
import logger from '../utils/logger';
import { calculateOffset } from '../utils/helpers';

export class SoviService {
    async getDistrictData(districtId: number, year?: number): Promise<DistrictData[]> {
        try {
            const whereClause: any = { districtId };

            if (year) {
                whereClause.year = year;
            }

            const data = await prisma.districtData.findMany({
                where: whereClause,
                orderBy: { year: 'desc' }
            });

            return data.map((item: any) => ({
                ...item,
                NOSCL: item.NOSCL ?? null,
                PRIMSC: item.PRIMSC ?? null,
                ENRLPR: item.ENRLPR ?? null,
                ENRMA: item.ENRMA ?? null,
                PATS: item.PATS ?? null,
                ADLLIT: item.ADLLIT ?? null,
                Sedu: item.Sedu ?? null,
                DIARR: item.DIARR ?? null,
                IMMUN: item.IMMUN ?? null,
                WTTI: item.WTTI ?? null,
                CbyladyH_W_PRE: item.CbyladyH_W_PRE ?? null,
                CbyladyH_W_POST: item.CbyladyH_W_POST ?? null,
                PNCONSL: item.PNCONSL ?? null,
                FERTILITY: item.FERTILITY ?? null,
                CHDISABL: item.CHDISABL ?? null,
                Shealth: item.Shealth ?? null,
                TENURE: item.TENURE ?? null,
                ROOMS: item.ROOMS ?? null,
                ELECTRIC: item.ELECTRIC ?? null,
                TAPWATER: item.TAPWATER ?? null,
                MEDIA: item.MEDIA ?? null,
                INTERNET: item.INTERNET ?? null,
                Sfacility: item.Sfacility ?? null,
                QAGRI: item.QAGRI ?? null,
                REMITT: item.REMITT ?? null,
                ECoH: item.ECoH ?? null,
                BHU_F: item.BHU_F ?? null,
                Fmly_P: item.Fmly_P ?? null,
                Sch_F: item.Sch_F ?? null,
                Vat_F: item.Vat_F ?? null,
                Agro_F: item.Agro_F ?? null,
                Pol_F: item.Pol_F ?? null,
                Seconomic: item.Seconomic ?? null,
                QOLD: item.QOLD ?? null,
                QMID: item.QMID ?? null,
                Fpop: item.Fpop ?? null,
                Rpop: item.Rpop ?? null,
                Upop: item.Upop ?? null,
                QKIDS: item.QKIDS ?? null,
                Growth_Rate: item.Growth_Rate ?? null,
                Spopulation: item.Spopulation ?? null,
                totalSoVI: item.totalSoVI ?? null,
                rating: item.rating ?? null
            }));
        } catch (error) {
            logger.error(`Get district data error (District ID: ${districtId}):`, error);
            throw error;
        }
    }

    async getLatestDistrictData(districtId: number): Promise<DistrictData | null> {
        try {
            const data = await prisma.districtData.findFirst({
                where: { districtId },
                orderBy: { year: 'desc' }
            });

            return data
                ? {
                    ...data,
                    NOSCL: data.NOSCL ?? null,
                    PRIMSC: data.PRIMSC ?? null,
                    ENRLPR: data.ENRLPR ?? null,
                    ENRMA: data.ENRMA ?? null,
                    PATS: data.PATS ?? null,
                    ADLLIT: data.ADLLIT ?? null,
                    Sedu: data.Sedu ?? null,
                    DIARR: data.DIARR ?? null,
                    IMMUN: data.IMMUN ?? null,
                    WTTI: data.WTTI ?? null,
                    CbyladyH_W_PRE: data.CbyladyH_W_PRE ?? null,
                    CbyladyH_W_POST: data.CbyladyH_W_POST ?? null,
                    PNCONSL: data.PNCONSL ?? null,
                    FERTILITY: data.FERTILITY ?? null,
                    CHDISABL: data.CHDISABL ?? null,
                    Shealth: data.Shealth ?? null,
                    TENURE: data.TENURE ?? null,
                    ROOMS: data.ROOMS ?? null,
                    ELECTRIC: data.ELECTRIC ?? null,
                    TAPWATER: data.TAPWATER ?? null,
                    MEDIA: data.MEDIA ?? null,
                    INTERNET: data.INTERNET ?? null,
                    Sfacility: data.Sfacility ?? null,
                    QAGRI: data.QAGRI ?? null,
                    REMITT: data.REMITT ?? null,
                    ECoH: data.ECoH ?? null,
                    BHU_F: data.BHU_F ?? null,
                    Fmly_P: data.Fmly_P ?? null,
                    Sch_F: data.Sch_F ?? null,
                    Vat_F: data.Vat_F ?? null,
                    Agro_F: data.Agro_F ?? null,
                    Pol_F: data.Pol_F ?? null,
                    Seconomic: data.Seconomic ?? null,
                    QOLD: data.QOLD ?? null,
                    QMID: data.QMID ?? null,
                    Fpop: data.Fpop ?? null,
                    Rpop: data.Rpop ?? null,
                    Upop: data.Upop ?? null,
                    QKIDS: data.QKIDS ?? null,
                    Growth_Rate: data.Growth_Rate ?? null,
                    Spopulation: data.Spopulation ?? null,
                    totalSoVI: data.totalSoVI ?? null,
                    rating: data.rating ?? null
                }
                : null;
        } catch (error) {
            logger.error(`Get latest district data error (District ID: ${districtId}):`, error);
            throw error;
        }
    }

    async createOrUpdateDistrictData(dataInput: CreateDistrictDataInput): Promise<DistrictData> {
        try {
            // Validate input
            const validation = validateSoVIData(dataInput);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Check if district exists
            const district = await prisma.district.findUnique({
                where: { id: dataInput.districtId }
            });

            if (!district) {
                throw new Error('District not found');
            }

            // Check if data already exists for this year
            const existingData = await prisma.districtData.findFirst({
                where: {
                    districtId: dataInput.districtId,
                    year: dataInput.year
                }
            });

            // Calculate scores
            const calculatedScores = calculateScores(dataInput);

            let districtData: DistrictData;

            if (existingData) {
                // Update existing data
                districtData = await prisma.districtData.update({
                    where: { id: existingData.id },
                    data: {
                        ...dataInput,
                        ...calculatedScores
                    }
                }) as DistrictData;
            } else {
                // Create new data
                districtData = await prisma.districtData.create({
                    data: {
                        ...dataInput,
                        ...calculatedScores
                    }
                }) as DistrictData;
            }

            // Update district's overall score with latest data
            await this.updateDistrictOverallScore(dataInput.districtId);

            logger.info(`District data ${existingData ? 'updated' : 'created'} for ${district.name} (Year: ${dataInput.year})`);

            return districtData;
        } catch (error) {
            logger.error('Create/update district data error:', error);
            throw error;
        }
    }

    async updateDistrictOverallScore(districtId: number): Promise<void> {
        try {
            const latestData = await this.getLatestDistrictData(districtId);

            if (latestData && latestData.totalSoVI !== null) {
                await prisma.district.update({
                    where: { id: districtId },
                    data: {
                        soviScore: latestData.totalSoVI,
                        rating: latestData.rating
                    }
                });
            }
        } catch (error) {
            logger.error(`Update district overall score error (District ID: ${districtId}):`, error);
            throw error;
        }
    }

    async deleteDistrictData(id: number): Promise<boolean> {
        try {
            // Get data to know district ID
            const data = await prisma.districtData.findUnique({
                where: { id }
            });

            if (!data) {
                throw new Error('District data not found');
            }

            // Delete the data
            await prisma.districtData.delete({
                where: { id }
            });

            // Update district's overall score
            await this.updateDistrictOverallScore(data.districtId);

            logger.info(`District data deleted (ID: ${id})`);

            return true;
        } catch (error) {
            logger.error(`Delete district data error (ID: ${id}):`, error);
            throw error;
        }
    }

    async getMapData(): Promise<MapDistrictData[]> {
        try {
            const districts = await prisma.district.findMany({
                include: {
                    data: {
                        orderBy: { year: 'desc' },
                        take: 1
                    }
                }
            });

            return districts.map((district: any) => ({
                id: district.id,
                name: district.name,
                fid: district.fid || undefined,
                division: district.division || undefined,
                province: district.province || undefined,
                country: district.country,
                soviScore: district.data[0]?.totalSoVI || 0,
                rating: district.data[0]?.rating || 1,
                scores: district.data[0] ? {
                    Sedu: district.data[0].Sedu || 0,
                    Shealth: district.data[0].Shealth || 0,
                    Sfacility: district.data[0].Sfacility || 0,
                    Seconomic: district.data[0].Seconomic || 0,
                    Spopulation: district.data[0].Spopulation || 0
                } : null
            }));
        } catch (error) {
            logger.error('Get map data error:', error);
            throw error;
        }
    }

    async getYearlyTrends(districtId: number): Promise<{
        years: number[];
        scores: number[];
        parameters: {
            Sedu: number[];
            Shealth: number[];
            Sfacility: number[];
            Seconomic: number[];
            Spopulation: number[];
        }
    }> {
        try {
            const data = await prisma.districtData.findMany({
                where: { districtId },
                orderBy: { year: 'asc' }
            });

            const years = data.map((d: any) => d.year);
            const scores = data.map((d: any) => d.totalSoVI || 0);

            const parameters = {
                Sedu: data.map((d: any) => d.Sedu || 0),
                Shealth: data.map((d: any) => d.Shealth || 0),
                Sfacility: data.map((d: any) => d.Sfacility || 0),
                Seconomic: data.map((d: any) => d.Seconomic || 0),
                Spopulation: data.map((d: any) => d.Spopulation || 0)
            };

            return {
                years,
                scores,
                parameters
            };
        } catch (error) {
            logger.error(`Get yearly trends error (District ID: ${districtId}):`, error);
            throw error;
        }
    }

    async getComparativeAnalysis(districtId: number): Promise<{
        district: MapDistrictData;
        provinceAverage: number;
        nationalAverage: number;
        similarDistricts: MapDistrictData[];
    }> {
        try {
            // Get district data
            const district = await prisma.district.findUnique({
                where: { id: districtId },
                include: {
                    data: {
                        orderBy: { year: 'desc' },
                        take: 1
                    }
                }
            });

            if (!district) {
                throw new Error('District not found');
            }

            // Get province average
            const provinceDistricts = await prisma.district.findMany({
                where: {
                    province: district.province,
                    id: { not: districtId }
                },
                include: {
                    data: {
                        orderBy: { year: 'desc' },
                        take: 1
                    }
                }
            });

            const provinceScores = provinceDistricts
                .map((d: any) => d.data[0]?.totalSoVI)
                .filter((score: any) => score !== null && score !== undefined) as number[];

            const provinceAverage = provinceScores.length > 0
                ? provinceScores.reduce((a, b) => a + b, 0) / provinceScores.length
                : 0;

            // Get national average
            const allDistricts = await prisma.district.findMany({
                include: {
                    data: {
                        orderBy: { year: 'desc' },
                        take: 1
                    }
                }
            });

            const nationalScores = allDistricts
                .map((d: any) => d.data[0]?.totalSoVI)
                .filter((score: any) => score !== null && score !== undefined) as number[];

            const nationalAverage = nationalScores.length > 0
                ? nationalScores.reduce((a, b) => a + b, 0) / nationalScores.length
                : 0;

            // Get similar districts (within ±5 points)
            const districtScore = district.data[0]?.totalSoVI || 0;
            const similarDistricts = allDistricts
                .filter((d: any) =>
                    d.id !== districtId &&
                    d.data[0]?.totalSoVI &&
                    Math.abs((d.data[0]?.totalSoVI || 0) - districtScore) <= 5
                )
                .slice(0, 5) // Top 5 most similar
                .map((d: any) => ({
                    id: d.id,
                    name: d.name,
                    fid: d.fid || undefined,
                    division: d.division || undefined,
                    province: d.province || undefined,
                    country: d.country || 'Pakistan',
                    soviScore: d.data[0]?.totalSoVI || 0,
                    rating: d.data[0]?.rating || 1,
                    scores: d.data[0] ? {
                        Sedu: d.data[0].Sedu || 0,
                        Shealth: d.data[0].Shealth || 0,
                        Sfacility: d.data[0].Sfacility || 0,
                        Seconomic: d.data[0].Seconomic || 0,
                        Spopulation: d.data[0].Spopulation || 0
                    } : null
                } as MapDistrictData));

            const districtData: MapDistrictData = {
                id: district.id,
                name: district.name,
                fid: district.fid || undefined,
                division: district.division || undefined,
                province: district.province || undefined,
                country: district.country || 'Pakistan',
                soviScore: districtScore,
                rating: district.data[0]?.rating || 1,
                scores: district.data[0] ? {
                    Sedu: district.data[0].Sedu || 0,
                    Shealth: district.data[0].Shealth || 0,
                    Sfacility: district.data[0].Sfacility || 0,
                    Seconomic: district.data[0].Seconomic || 0,
                    Spopulation: district.data[0].Spopulation || 0
                } : null
            };

            return {
                district: districtData,
                provinceAverage: Number(provinceAverage.toFixed(2)),
                nationalAverage: Number(nationalAverage.toFixed(2)),
                similarDistricts
            };
        } catch (error) {
            logger.error(`Get comparative analysis error (District ID: ${districtId}):`, error);
            throw error;
        }
    }

    async bulkUpdateDistrictData(data: CreateDistrictDataInput[]): Promise<{ success: number; failed: number; errors: string[] }> {
        try {
            const results = await Promise.allSettled(
                data.map(item => this.createOrUpdateDistrictData(item))
            );

            const success = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            const errors = results
                .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
                .map(r => r.reason.message);

            return {
                success,
                failed,
                errors
            };
        } catch (error) {
            logger.error('Bulk update district data error:', error);
            throw error;
        }
    }
}

export default new SoviService();