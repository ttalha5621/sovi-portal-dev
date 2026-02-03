import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react'
import districtService from '../services/district.service'
import soviService from '../services/sovi.service'
import {
    District,
    DistrictListItem,
    DistrictWithData,
    DistrictData,
    DistrictsResponse,
    DistrictsSummary,
    MapDistrictData,
    YearlyTrends,
    ComparativeAnalysis,
} from '../types/sovi.types'
import { showError } from '../utils/helpers'

interface DistrictContextType {
    // State
    districts: DistrictListItem[]
    selectedDistrict: DistrictWithData | null
    districtData: DistrictData | null
    mapData: MapDistrictData[]
    summary: DistrictsSummary | null
    loading: boolean
    error: string | null

    // District operations
    fetchDistricts: (page?: number, limit?: number) => Promise<void>
    searchDistricts: (query: string, page?: number, limit?: number) => Promise<void>
    selectDistrict: (districtId: number) => Promise<void>
    createDistrict: (data: any) => Promise<District>
    updateDistrict: (id: number, data: any) => Promise<District>
    deleteDistrict: (id: number) => Promise<void>

    // Data operations
    fetchDistrictData: (districtId: number, year?: number) => Promise<DistrictData[]>
    createOrUpdateDistrictData: (data: any) => Promise<DistrictData>
    deleteDistrictData: (id: number) => Promise<void>

    // Analysis operations
    fetchMapData: () => Promise<void>
    fetchSummary: () => Promise<void>
    fetchYearlyTrends: (districtId: number) => Promise<YearlyTrends>
    fetchComparativeAnalysis: (districtId: number) => Promise<ComparativeAnalysis>

    // Utility
    clearSelectedDistrict: () => void
    clearError: () => void
}

const DistrictContext = createContext<DistrictContextType | undefined>(undefined)

export const useDistricts = () => {
    const context = useContext(DistrictContext)
    if (!context) {
        throw new Error('useDistricts must be used within a DistrictProvider')
    }
    return context
}

interface DistrictProviderProps {
    children: ReactNode
}

export const DistrictProvider: React.FC<DistrictProviderProps> = ({ children }) => {
    const [districts, setDistricts] = useState<DistrictListItem[]>([])
    const [selectedDistrict, setSelectedDistrict] = useState<DistrictWithData | null>(null)
    const [districtData, setDistrictData] = useState<DistrictData | null>(null)
    const [mapData, setMapData] = useState<MapDistrictData[]>([])
    const [summary, setSummary] = useState<DistrictsSummary | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const clearError = () => setError(null)

    const fetchDistricts = useCallback(async (page: number = 1, limit: number = 50) => {
        try {
            setLoading(true)
            clearError()

            const response = await districtService.getAllDistricts(page, limit)
            setDistricts(response.districts)
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch districts'
            setError(message)
            showError(message)
        } finally {
            setLoading(false)
        }
    }, [])

    const searchDistricts = useCallback(async (query: string, page: number = 1, limit: number = 20) => {
        try {
            setLoading(true)
            clearError()

            const response = await districtService.searchDistricts(query, page, limit)
            setDistricts(response.districts)
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to search districts'
            setError(message)
            showError(message)
        } finally {
            setLoading(false)
        }
    }, [])

    const selectDistrict = useCallback(async (districtId: number) => {
        try {
            setLoading(true)
            clearError()

            const district = await districtService.getDistrictById(districtId)
            setSelectedDistrict(district)

            if (district.data && district.data.length > 0) {
                setDistrictData(district.data[0])
            } else {
                setDistrictData(null)
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch district'
            setError(message)
            showError(message)
        } finally {
            setLoading(false)
        }
    }, [])

    const createDistrict = useCallback(async (data: any): Promise<District> => {
        try {
            setLoading(true)
            clearError()

            const district = await districtService.createDistrict(data)
            await fetchDistricts()

            return district
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to create district'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [fetchDistricts])

    const updateDistrict = useCallback(async (id: number, data: any): Promise<District> => {
        try {
            setLoading(true)
            clearError()

            const district = await districtService.updateDistrict(id, data)

            // Update local state
            setDistricts(prev => prev.map(d =>
                d.id === id ? { ...d, name: data.name || d.name, province: data.province || d.province } : d
            ))

            if (selectedDistrict?.id === id) {
                setSelectedDistrict(prev => prev ? { ...prev, ...data } : null)
            }

            return district
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update district'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [selectedDistrict])

    const deleteDistrict = useCallback(async (id: number) => {
        try {
            setLoading(true)
            clearError()

            await districtService.deleteDistrict(id)

            // Update local state
            setDistricts(prev => prev.filter(d => d.id !== id))

            if (selectedDistrict?.id === id) {
                clearSelectedDistrict()
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete district'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [selectedDistrict])

    const fetchDistrictData = useCallback(async (districtId: number, year?: number): Promise<DistrictData[]> => {
        try {
            setLoading(true)
            clearError()

            const data = await soviService.getDistrictData(districtId, year)

            if (data.length > 0 && !year) {
                setDistrictData(data[0])
            }

            return data
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch district data'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const createOrUpdateDistrictData = useCallback(async (data: any): Promise<DistrictData> => {
        try {
            setLoading(true)
            clearError()

            const result = await soviService.createOrUpdateDistrictData(data)
            setDistrictData(result)

            // Update selected district score
            if (selectedDistrict && selectedDistrict.id === data.districtId) {
                setSelectedDistrict((prev: DistrictWithData | null) => prev ? {
                    ...prev,
                    soviScore: result.totalSoVI,
                    rating: result.rating,
                } : null)
            }

            // Update districts list
            setDistricts((prev: DistrictListItem[]) => prev.map(d =>
                d.id === data.districtId ? {
                    ...d,
                    soviScore: result.totalSoVI,
                    rating: result.rating,
                } : d
            ))

            return result
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to save district data'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [selectedDistrict])

    const deleteDistrictData = useCallback(async (id: number) => {
        try {
            setLoading(true)
            clearError()

            await soviService.deleteDistrictData(id)
            setDistrictData(null)
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete district data'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchMapData = useCallback(async () => {
        try {
            setLoading(true)
            clearError()

            const data = await soviService.getMapData()
            setMapData(data)
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch map data'
            setError(message)
            showError(message)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchSummary = useCallback(async () => {
        try {
            setLoading(true)
            clearError()

            const data = await districtService.getDistrictsSummary()
            setSummary(data)
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch summary'
            setError(message)
            showError(message)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchYearlyTrends = useCallback(async (districtId: number): Promise<YearlyTrends> => {
        try {
            setLoading(true)
            clearError()

            const data = await soviService.getYearlyTrends(districtId)
            return data
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch trends'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchComparativeAnalysis = useCallback(async (districtId: number): Promise<ComparativeAnalysis> => {
        try {
            setLoading(true)
            clearError()

            const data = await soviService.getComparativeAnalysis(districtId)
            return data
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch analysis'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const clearSelectedDistrict = () => {
        setSelectedDistrict(null)
        setDistrictData(null)
    }

    const value: DistrictContextType = {
        // State
        districts,
        selectedDistrict,
        districtData,
        mapData,
        summary,
        loading,
        error,

        // District operations
        fetchDistricts,
        searchDistricts,
        selectDistrict,
        createDistrict,
        updateDistrict,
        deleteDistrict,

        // Data operations
        fetchDistrictData,
        createOrUpdateDistrictData,
        deleteDistrictData,

        // Analysis operations
        fetchMapData,
        fetchSummary,
        fetchYearlyTrends,
        fetchComparativeAnalysis,

        // Utility
        clearSelectedDistrict,
        clearError,
    }

    return (
        <DistrictContext.Provider value={value}>
            {children}
        </DistrictContext.Provider>
    )
}