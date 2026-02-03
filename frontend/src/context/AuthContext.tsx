import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import authService from '../services/auth.service'
import { User, LoginRequest, RegisterRequest } from '../types/user.types'
import { showError, showSuccess } from '../utils/helpers'

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (data: LoginRequest) => Promise<void>
    register: (data: RegisterRequest) => Promise<void>
    logout: () => void
    updateProfile: (data: Partial<User>) => Promise<void>
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>
    isAuthenticated: boolean
    isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            setLoading(true)

            if (authService.isAuthenticated()) {
                const { isValid, user: userData } = await authService.verifyToken()

                if (isValid && userData) {
                    setUser(userData)
                } else {
                    authService.logout()
                }
            }
        } catch (error) {
            authService.logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (data: LoginRequest) => {
        try {
            setLoading(true)
            const response = await authService.login(data)
            setUser(response.user)
            showSuccess('Login successful')
        } catch (error: any) {
            showError(error.response?.data?.message || 'Login failed')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const register = async (data: RegisterRequest) => {
        try {
            setLoading(true)
            const response = await authService.register(data)
            setUser(response.user)
            showSuccess('Registration successful')
        } catch (error: any) {
            showError(error.response?.data?.message || 'Registration failed')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        authService.logout()
        setUser(null)
        showSuccess('Logged out successfully')
    }

    const updateProfile = async (data: Partial<User>) => {
        try {
            setLoading(true)
            const updatedUser = await authService.updateProfile(data)
            setUser(updatedUser)
            showSuccess('Profile updated successfully')
        } catch (error: any) {
            showError(error.response?.data?.message || 'Failed to update profile')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const changePassword = async (oldPassword: string, newPassword: string) => {
        try {
            setLoading(true)
            await authService.changePassword({ oldPassword, newPassword })
            showSuccess('Password changed successfully')
        } catch (error: any) {
            showError(error.response?.data?.message || 'Failed to change password')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const isAuthenticated = !!user
    const isAdmin = user?.role === 'ADMIN'

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated,
        isAdmin,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}