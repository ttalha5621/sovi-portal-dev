import { useState, useCallback } from 'react'
import soviService from '../services/sovi.service'
import { DistrictData, CreateDistrictDataInput, CalculatedScores } from '../types/sovi.types'
import { showError } from '../utils/helpers'

export const useSoviData = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const calculateScores = useCallback(async (data: any): Promise<CalculatedScores> => {
        try {
            setLoading(true)
            setError(null)

            const result = await soviService.calculateScore(data)
            return result
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to calculate scores'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const saveDistrictData = useCallback(async (data: CreateDistrictDataInput): Promise<DistrictData> => {
        try {
            setLoading(true)
            setError(null)

            const result = await soviService.createOrUpdateDistrictData(data)
            return result
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to save district data'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchDistrictData = useCallback(async (districtId: number, year?: number): Promise<DistrictData[]> => {
        try {
            setLoading(true)
            setError(null)

            const data = await soviService.getDistrictData(districtId, year)
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

    const deleteDistrictData = useCallback(async (id: number): Promise<void> => {
        try {
            setLoading(true)
            setError(null)

            await soviService.deleteDistrictData(id)
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete district data'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const validateImprovement = useCallback(async (currentData: any, newData: any): Promise<any> => {
        try {
            setLoading(true)
            setError(null)

            const result = await soviService.validateScoreImprovement(currentData, newData)
            return result
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to validate improvement'
            setError(message)
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const clearError = () => setError(null)

    return {
        loading,
        error,
        calculateScores,
        saveDistrictData,
        fetchDistrictData,
        deleteDistrictData,
        validateImprovement,
        clearError,
    }
}