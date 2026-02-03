import { useState, useEffect } from 'react'
import { api } from '../services/api'

export interface District {
    id: string
    name: string
    province: string
    createdAt: string
    updatedAt: string
}

export const useDistricts = () => {
    const [districts, setDistricts] = useState<District[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchDistricts = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.get('/districts')
            setDistricts(response.data)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch districts')
        } finally {
            setLoading(false)
        }
    }

    const createDistrict = async (districtData: Omit<District, 'id' | 'createdAt' | 'updatedAt'>) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.post('/districts', districtData)
            setDistricts(prev => [...prev, response.data])
            return response.data
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create district')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateDistrict = async (id: string, districtData: Partial<Omit<District, 'id' | 'createdAt' | 'updatedAt'>>) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.put(`/districts/${id}`, districtData)
            setDistricts(prev => prev.map(district => district.id === id ? response.data : district))
            return response.data
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update district')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const deleteDistrict = async (id: string) => {
        setLoading(true)
        setError(null)
        try {
            await api.delete(`/districts/${id}`)
            setDistricts(prev => prev.filter(district => district.id !== id))
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete district')
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDistricts()
    }, [])

    return {
        districts,
        loading,
        error,
        fetchDistricts,
        createDistrict,
        updateDistrict,
        deleteDistrict
    }
}