import React, { ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost'
    size?: 'small' | 'medium' | 'large'
    loading?: boolean
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
    fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    className,
    ...props
}) => {
    const buttonClasses = clsx(
        'button',
        `button-${variant}`,
        `button-${size}`,
        {
            'button-loading': loading,
            'button-full-width': fullWidth,
            'button-disabled': disabled || loading,
        },
        className
    )

    return (
        <button
            className={buttonClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <span className="button-spinner">
                    <div className="spinner-small" />
                </span>
            )}

            {!loading && icon && iconPosition === 'left' && (
                <span className="button-icon-left">{icon}</span>
            )}

            <span className="button-content">{children}</span>

            {!loading && icon && iconPosition === 'right' && (
                <span className="button-icon-right">{icon}</span>
            )}
        </button>
    )
}

export default Button