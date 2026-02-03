import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../context/AuthContext'
import { registerSchema } from '../../utils/validators'
import { showError } from '../../utils/helpers'
import { ROUTES } from '../../utils/constants'
import Input from '../common/Input'
import Button from '../common/Button'
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi'
import './Register.css'

interface RegisterFormData {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const { register: registerUser } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const password = watch('password')

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setLoading(true)
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
            })
            navigate(ROUTES.HOME)
        } catch (error: any) {
            showError(error.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-container">
            <div className="register-card">
                {/* Header */}
                <div className="register-header">
                    <div className="register-logo">
                        <FiUserPlus className="register-logo-icon" />
                    </div>
                    <h1 className="register-title">Create Account</h1>
                    <p className="register-subtitle">Join the SoVI Portal community</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="register-form">
                    <Input
                        label="Full Name"
                        type="text"
                        leftIcon={<FiUser />}
                        error={errors.name?.message}
                        fullWidth
                        {...register('name')}
                    />

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
                        helperText="Minimum 6 characters"
                        fullWidth
                        {...register('password')}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        leftIcon={<FiLock />}
                        error={errors.confirmPassword?.message}
                        fullWidth
                        {...register('confirmPassword', {
                            validate: (value) =>
                                value === password || 'Passwords do not match',
                        })}
                    />

                    <div className="register-terms">
                        <input type="checkbox" id="terms" className="terms-checkbox" required />
                        <label htmlFor="terms" className="terms-label">
                            I agree to the{' '}
                            <Link to="/terms" className="terms-link">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="terms-link">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        loading={loading}
                        fullWidth
                        className="register-button"
                    >
                        Create Account
                    </Button>
                </form>

                {/* Divider */}
                <div className="register-divider">
                    <span className="divider-text">or</span>
                </div>

                {/* Login Link */}
                <div className="register-login-link">
                    <p className="login-link-text">
                        Already have an account?{' '}
                        <Link to={ROUTES.LOGIN} className="login-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Features */}
            <div className="register-features">
                <div className="features-grid">
                    <div className="feature">
                        <div className="feature-icon">
                            <FiUser className="w-6 h-6" />
                        </div>
                        <h3 className="feature-title">User Management</h3>
                        <p className="feature-description">
                            Manage user roles and permissions with ease
                        </p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">
                            <FiLock className="w-6 h-6" />
                        </div>
                        <h3 className="feature-title">Secure Access</h3>
                        <p className="feature-description">
                            Enterprise-grade security and encryption
                        </p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">
                            <FiMail className="w-6 h-6" />
                        </div>
                        <h3 className="feature-title">Collaboration</h3>
                        <p className="feature-description">
                            Work together with your team seamlessly
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register