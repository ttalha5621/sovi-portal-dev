import React, { InputHTMLAttributes, forwardRef, useState } from 'react'
import { clsx } from 'clsx'
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi'
import './Input.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    success?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    helperText?: string
    fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            success,
            leftIcon,
            rightIcon,
            helperText,
            fullWidth = false,
            className,
            type,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false)
        const isPassword = type === 'password'

        const inputClasses = clsx(
            'input',
            {
                'input-error': error,
                'input-success': success,
                'input-left-icon': leftIcon,
                'input-right-icon': rightIcon || isPassword,
                'input-full-width': fullWidth,
            },
            className
        )

        const renderRightIcon = () => {
            if (isPassword) {
                return (
                    <button
                        type="button"
                        className="input-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                )
            }

            if (error) {
                return <FiX className="input-icon-error" />
            }

            if (success) {
                return <FiCheck className="input-icon-success" />
            }

            return rightIcon
        }

        return (
            <div className="input-container">
                {label && (
                    <label className="input-label">
                        {label}
                        {props.required && <span className="input-required">*</span>}
                    </label>
                )}

                <div className="input-wrapper">
                    {leftIcon && (
                        <div className="input-left-icon-container">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={isPassword && showPassword ? 'text' : type}
                        className={inputClasses}
                        aria-invalid={!!error}
                        {...props}
                    />

                    {(rightIcon || isPassword || error || success) && (
                        <div className="input-right-icon-container">
                            {renderRightIcon()}
                        </div>
                    )}
                </div>

                {(error || helperText) && (
                    <div className="input-message-container">
                        {error && (
                            <p className="input-error-message" role="alert">
                                {error}
                            </p>
                        )}
                        {helperText && !error && (
                            <p className="input-helper-text">
                                {helperText}
                            </p>
                        )}
                    </div>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input