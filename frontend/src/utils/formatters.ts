import { format, formatDistance, formatRelative, parseISO } from 'date-fns'
import { SOVI_CONSTANTS } from './constants'

// Date formatters
export function formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'dd MMM yyyy')
}

export function formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'dd MMM yyyy HH:mm')
}

export function formatTimeAgo(date: Date | string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatDistance(dateObj, new Date(), { addSuffix: true })
}

export function formatRelativeDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatRelative(dateObj, new Date())
}

// Number formatters
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num)
}

export function formatPercentage(num: number): string {
    return `${num.toFixed(1)}%`
}

export function formatCurrency(amount: number, currency: string = 'PKR'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

// Score formatters
export function formatScore(score?: number): string {
    if (score === undefined || score === null) return 'N/A'
    return score.toFixed(2)
}

export function getRatingDisplay(rating?: number): {
    label: string
    color: string
    description: string
} {
    const defaultRating = {
        label: 'Unknown',
        color: '#6b7280',
        description: 'No rating available',
    }

    if (!rating) return defaultRating

    const threshold = SOVI_CONSTANTS.RATING_THRESHOLDS.find(t => t.rating === rating)

    if (!threshold) return defaultRating

    const descriptions = {
        1: 'Very low vulnerability - Excellent conditions',
        2: 'Low vulnerability - Good conditions',
        3: 'Medium vulnerability - Moderate conditions',
        4: 'High vulnerability - Concerning conditions',
        5: 'Extreme vulnerability - Critical conditions',
    }

    return {
        label: threshold.label,
        color: threshold.color,
        description: descriptions[rating as keyof typeof descriptions] || 'No description available',
    }
}

// Text formatters
export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function truncate(text: string, length: number = 50): string {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// File size formatter
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Phone number formatter
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }

    return phone
}

// URL formatter
export function formatUrl(url: string): string {
    try {
        const urlObj = new URL(url)
        return urlObj.hostname.replace('www.', '')
    } catch {
        return url
    }
}

// Array formatters
export function formatList(items: string[], maxItems: number = 3): string {
    if (items.length <= maxItems) {
        return items.join(', ')
    }

    const firstItems = items.slice(0, maxItems)
    return `${firstItems.join(', ')} and ${items.length - maxItems} more`
}