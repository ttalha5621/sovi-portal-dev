import axios from 'axios'
import { getAuthToken, removeAuthToken, removeUserData } from '../utils/helpers'
import { API_CONFIG } from '../utils/constants'

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken()

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle token expiration
        if (error.response?.status === 401) {
            removeAuthToken()
            removeUserData()
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)

// API methods
export const apiGet = async <T>(url: string, params?: any): Promise<T> => {
    try {
        const response = await api.get<T>(url, { params })
        return response.data
    } catch (error) {
        throw error
    }
}

export const apiPost = async <T>(url: string, data?: any): Promise<T> => {
    try {
        const response = await api.post<T>(url, data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const apiPut = async <T>(url: string, data?: any): Promise<T> => {
    try {
        const response = await api.put<T>(url, data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const apiPatch = async <T>(url: string, data?: any): Promise<T> => {
    try {
        const response = await api.patch<T>(url, data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const apiDelete = async <T>(url: string): Promise<T> => {
    try {
        const response = await api.delete<T>(url)
        return response.data
    } catch (error) {
        throw error
    }
}

export default api