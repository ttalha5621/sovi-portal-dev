import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'
import { ROUTES } from '../../utils/constants'

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAdmin?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAdmin = false
}) => {
    const { user, loading, isAdmin } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" message="Loading..." />
            </div>
        )
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
    }

    if (requireAdmin && !isAdmin) {
        // Redirect to home if not admin
        return <Navigate to={ROUTES.HOME} replace />
    }

    return <>{children}</>
}

export default ProtectedRoute