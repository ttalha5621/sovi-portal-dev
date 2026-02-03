import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../context/AuthContext'
import { loginSchema } from '../../utils/validators'
import { showError } from '../../utils/helpers'
import { ROUTES } from '../../utils/constants'
import Input from '../common/Input'
import Button from '../common/Button'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import './Login.css'

interface LoginFormData {
    email: string
    password: string
}

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            setLoading(true)
            await login(data)
            navigate(ROUTES.HOME)
        } catch (error: any) {
            showError(error.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    <div className="login-logo">
                        <FiLogIn className="login-logo-icon" />
                    </div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to your SoVI Portal account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <Input
                        label="Email Address"
                        type="email"
                        leftIcon={<FiMail />}
                        error={errors.email?.message}
                        fullWidth
                        {...register('email')}
                    />

                    <Input
                        label="Password"
                        type="password"
                        leftIcon={<FiLock />}
                        error={errors.password?.message}
                        fullWidth
                        {...register('password')}
                    />

                    <div className="login-options">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" className="remember-checkbox" />
                            <label htmlFor="remember" className="remember-label">
                                Remember me
                            </label>
                        </div>
                        <Link to="/forgot-password" className="forgot-password">
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        loading={loading}
                        fullWidth
                        className="login-button"
                    >
                        Sign In
                    </Button>
                </form>

                {/* Divider */}
                <div className="login-divider">
                    <span className="divider-text">or</span>
                </div>

                {/* Additional Options */}
                <div className="login-other-options">
                    <Button variant="outline" fullWidth>
                        Sign in with SSO
                    </Button>
                </div>

                {/* Footer */}
                <div className="login-footer">
                    <p className="footer-text">
                        Don't have an account?{' '}
                        <Link to={ROUTES.REGISTER} className="footer-link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Background Pattern */}
            <div className="login-background">
                <div className="background-pattern" />
            </div>
        </div>
    )
}

export default Login