import { toast } from 'react-hot-toast'
import { STORAGE_KEYS } from './constants'

// Storage helpers
export function getStorageItem<T>(key: string, defaultValue: T): T {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
    } catch {
        return defaultValue
    }
}

export function setStorageItem<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.error('Error setting storage item:', error)
    }
}

export function removeStorageItem(key: string): void {
    try {
        localStorage.removeItem(key)
    } catch (error) {
        console.error('Error removing storage item:', error)
    }
}

export function clearStorage(): void {
    try {
        localStorage.clear()
    } catch (error) {
        console.error('Error clearing storage:', error)
    }
}

// Auth helpers
export function getAuthToken(): string | null {
    return getStorageItem(STORAGE_KEYS.AUTH_TOKEN, null)
}

export function setAuthToken(token: string): void {
    setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token)
}

export function removeAuthToken(): void {
    removeStorageItem(STORAGE_KEYS.AUTH_TOKEN)
}

export function getUserData() {
    return getStorageItem(STORAGE_KEYS.USER_DATA, null)
}

export function setUserData(data: any): void {
    setStorageItem(STORAGE_KEYS.USER_DATA, data)
}

export function removeUserData(): void {
    removeStorageItem(STORAGE_KEYS.USER_DATA)
}

// Toast helpers
export function showSuccess(message: string): void {
    toast.success(message, {
        duration: 4000,
        position: 'top-right',
    })
}

export function showError(message: string): void {
    toast.error(message, {
        duration: 4000,
        position: 'top-right',
    })
}

export function showLoading(message: string): string {
    return toast.loading(message)
}

export function dismissToast(toastId?: string): void {
    if (toastId) {
        toast.dismiss(toastId)
    } else {
        toast.dismiss()
    }
}

// URL helpers
export function buildUrl(baseUrl: string, params: Record<string, any>): string {
    const url = new URL(baseUrl)

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach(item => url.searchParams.append(key, item.toString()))
            } else {
                url.searchParams.append(key, value.toString())
            }
        }
    })

    return url.toString()
}

export function getQueryParam(name: string): string | null {
    const params = new URLSearchParams(window.location.search)
    return params.get(name)
}

export function setQueryParam(name: string, value: string): void {
    const params = new URLSearchParams(window.location.search)
    params.set(name, value)
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
}

// Validation helpers
export function isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function isPasswordValid(password: string): boolean {
    return password.length >= 6
}

export function isRequired(value: any): boolean {
    if (Array.isArray(value)) {
        return value.length > 0
    }
    return value !== undefined && value !== null && value !== ''
}

// Formatting helpers
export function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
            func(...args)
        }, wait)
    }
}

export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

// Array helpers
export function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }
    return chunks
}

export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
}

export function uniqueArray<T>(array: T[]): T[] {
    return [...new Set(array)]
}

// Object helpers
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
}

export function mergeObjects<T extends object, U extends object>(target: T, source: U): T & U {
    return { ...target, ...source }
}

export function isEmptyObject(obj: object): boolean {
    return Object.keys(obj).length === 0
}

// Color helpers
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null
}

export function getContrastColor(hexColor: string): string {
    const rgb = hexToRgb(hexColor)
    if (!rgb) return '#000000'

    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
    return luminance > 0.5 ? '#000000' : '#ffffff'
}

// Error handling
export function handleError(error: any, fallbackMessage: string = 'An error occurred'): void {
    const message = error?.response?.data?.message || error?.message || fallbackMessage
    showError(message)
    console.error('Error:', error)
}

// Performance helpers
export function measurePerformance<T extends (...args: any[]) => any>(
    func: T,
    label: string
): (...args: Parameters<T>) => ReturnType<T> {
    return (...args: Parameters<T>) => {
        console.time(label)
        const result = func(...args)
        console.timeEnd(label)
        return result
    }
}