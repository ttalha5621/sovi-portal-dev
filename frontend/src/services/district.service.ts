import { apiGet, apiPost, apiPut, apiDelete } from './api'
import {
    District,
    DistrictListItem,
    DistrictWithData,
    CreateDistrictInput,
    UpdateDistrictInput,
    DistrictsResponse,
    DistrictsSummary,
} from '../types/district.types'

class DistrictService {
    async getAllDistricts(page: number = 1, limit: number = 10): Promise<DistrictsResponse> {
        try {
            const response = await apiGet<{ data: DistrictsResponse }>('/districts', {
                page,
                limit,
            })
            return response.data
        } catch (error) {
            throw error
        }
    }

    async getDistrictById(id: number): Promise<DistrictWithData> {
        try {
            const response = await apiGet<{ data: DistrictWithData }>(`/districts/${id}`)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async createDistrict(data: CreateDistrictInput): Promise<District> {
        try {
            const response = await apiPost<{ data: District }>('/districts', data)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async updateDistrict(id: number, data: UpdateDistrictInput): Promise<District> {
        try {
            const response = await apiPut<{ data: District }>(`/districts/${id}`, data)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async deleteDistrict(id: number): Promise<void> {
        try {
            await apiDelete(`/districts/${id}`)
        } catch (error) {
            throw error
        }
    }

    async searchDistricts(query: string, page: number = 1, limit: number = 10): Promise<DistrictsResponse> {
        try {
            const response = await apiGet<{ data: DistrictsResponse }>('/districts/search', {
                q: query,
                page,
                limit,
            })
            return response.data
        } catch (error) {
            throw error
        }
    }

    async getDistrictsByProvince(province: string): Promise<District[]> {
        try {
            const response = await apiGet<{ data: District[] }>(`/districts/province/${province}`)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async getDistrictsSummary(): Promise<DistrictsSummary> {
        try {
            const response = await apiGet<{ data: DistrictsSummary }>('/districts/summary')
            return response.data
        } catch (error) {
            throw error
        }
    }

    async getDistrictsForMap(): Promise<any[]> {
        try {
            const response = await apiGet<{ data: any[] }>('/sovi/map-data')
            return response.data
        } catch (error) {
            throw error
        }
    }
}

export default new DistrictService()