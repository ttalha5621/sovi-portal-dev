import { apiPost, apiGet, apiPut, apiPatch } from './api'
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User,
    UpdateProfileRequest,
    ChangePasswordRequest,
} from '../types/user.types'
import { setAuthToken, setUserData, removeAuthToken, removeUserData, getAuthToken } from '../utils/helpers'

class AuthService {
    async login(data: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await apiPost<AuthResponse>('/auth/login', data)

            // Store token and user data
            setAuthToken(response.token)
            setUserData(response.user)

            return response
        } catch (error) {
            throw error
        }
    }

    async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await apiPost<AuthResponse>('/auth/register', data)

            // Store token and user data
            setAuthToken(response.token)
            setUserData(response.user)

            return response
        } catch (error) {
            throw error
        }
    }

    async getProfile(): Promise<User> {
        try {
            const response = await apiGet<{ data: User }>('/auth/profile')
            return response.data
        } catch (error) {
            throw error
        }
    }

    async updateProfile(data: UpdateProfileRequest): Promise<User> {
        try {
            const response = await apiPut<{ data: User }>('/auth/profile', data)
            setUserData(response.data)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async changePassword(data: ChangePasswordRequest): Promise<void> {
        try {
            await apiPost('/auth/change-password', data)
        } catch (error) {
            throw error
        }
    }

    async verifyToken(): Promise<{ isValid: boolean; user: User }> {
        try {
            const response = await apiGet<{ data: { isValid: boolean; user: User } }>('/auth/verify')
            return response.data
        } catch (error) {
            throw error
        }
    }

    logout(): void {
        removeAuthToken()
        removeUserData()
    }

    getCurrentUser(): User | null {
        return JSON.parse(localStorage.getItem('sovi_user_data') || 'null')
    }

    isAuthenticated(): boolean {
        return !!getAuthToken()
    }

    isAdmin(): boolean {
        const user = this.getCurrentUser()
        return user?.role === 'ADMIN'
    }
}

export default new AuthService()