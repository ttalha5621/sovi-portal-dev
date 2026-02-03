import { useState, useEffect } from 'react'
import { useAuth as useAuthContext } from '../context/AuthContext'
import { LoginRequest, RegisterRequest, User } from '../types/user.types'

export const useAuth = () => {
    const context = useAuthContext()
    const [isLoading, setIsLoading] = useState(false)

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true)
        try {
            await context.login(credentials)
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (userData: RegisterRequest) => {
        setIsLoading(true)
        try {
            await context.register(userData)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        ...context,
        login,
        register,
        isLoading: isLoading || context.loading
    }
}