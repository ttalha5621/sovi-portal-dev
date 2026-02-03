import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { FiX } from 'react-icons/fi'
import './Modal.css'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    size?: 'small' | 'medium' | 'large' | 'full'
    showCloseButton?: boolean
    closeOnOverlayClick?: boolean
    className?: string
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium',
    showCloseButton = true,
    closeOnOverlayClick = true,
    className,
}) => {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                closeOnOverlayClick &&
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                isOpen
            ) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.addEventListener('mousedown', handleClickOutside)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.removeEventListener('mousedown', handleClickOutside)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose, closeOnOverlayClick])

    if (!isOpen) return null

    const modalClasses = clsx(
        'modal',
        `modal-${size}`,
        className
    )

    const modalContent = (
        <div className="modal-overlay">
            <div className="modal-container" role="dialog" aria-modal="true">
                <div className={modalClasses} ref={modalRef}>
                    {/* Modal Header */}
                    {(title || showCloseButton) && (
                        <div className="modal-header">
                            {title && <h2 className="modal-title">{title}</h2>}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="modal-close-button"
                                    aria-label="Close modal"
                                >
                                    <FiX className="modal-close-icon" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Modal Content */}
                    <div className="modal-content">{children}</div>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}

export default Modal