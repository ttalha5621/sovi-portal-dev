import { apiGet, apiPost, apiDelete } from './api'
import {
    DistrictData,
    CreateDistrictDataInput,
    CalculatedScores,
    MapDistrictData,
    YearlyTrends,
    ComparativeAnalysis,
    ScoreImprovement,
} from '../types/sovi.types'

class SoviService {
    async getDistrictData(districtId: number, year?: number): Promise<DistrictData[]> {
        try {
            const response = await apiGet<{ data: DistrictData[] }>(`/sovi/district/${districtId}`, {
                year,
            })
            return response.data
        } catch (error) {
            throw error
        }
    }

    async getLatestDistrictData(districtId: number): Promise<DistrictData> {
        try {
            const response = await apiGet<{ data: DistrictData }>(`/sovi/district/${districtId}/latest`)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async createOrUpdateDistrictData(data: CreateDistrictDataInput): Promise<DistrictData> {
        try {
            const response = await apiPost<{ data: DistrictData }>('/sovi/district-data', data)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async deleteDistrictData(id: number): Promise<void> {
        try {
            await apiDelete(`/sovi/district-data/${id}`)
        } catch (error) {
            throw error
        }
    }

    async getMapData(): Promise<MapDistrictData[]> {
        try {
            const response = await apiGet<{ data: MapDistrictData[] }>('/sovi/map-data')
            return response.data
        } catch (error) {
            throw error
        }
    }

    async calculateScore(data: any): Promise<CalculatedScores> {
        try {
            const response = await apiPost<{ data: CalculatedScores }>('/sovi/calculate', data)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async getYearlyTrends(districtId: number): Promise<YearlyTrends> {
        try {
            const response = await apiGet<{ data: YearlyTrends }>(`/sovi/district/${districtId}/trends`)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async getComparativeAnalysis(districtId: number): Promise<ComparativeAnalysis> {
        try {
            const response = await apiGet<{ data: ComparativeAnalysis }>(`/sovi/district/${districtId}/compare`)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async bulkUpdateDistrictData(data: CreateDistrictDataInput[]): Promise<{
        success: number
        failed: number
        errors: string[]
    }> {
        try {
            const response = await apiPost<{ data: any }>('/sovi/bulk-update', data)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async validateScoreImprovement(currentData: any, newData: any): Promise<ScoreImprovement> {
        try {
            const response = await apiPost<{ data: ScoreImprovement }>('/sovi/validate-improvement', {
                currentData,
                newData,
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
}

export default new SoviService()