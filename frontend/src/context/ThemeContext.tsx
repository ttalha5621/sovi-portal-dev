import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { getStorageItem, setStorageItem } from '../utils/helpers'
import { STORAGE_KEYS } from '../utils/constants'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    resolvedTheme: 'light' | 'dark'
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

interface ThemeProviderProps {
    children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        return getStorageItem(STORAGE_KEYS.THEME, 'system')
    })

    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return theme
    })

    // Update resolved theme when theme changes
    useEffect(() => {
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

            const handleChange = (e: MediaQueryListEvent) => {
                setResolvedTheme(e.matches ? 'dark' : 'light')
            }

            setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
            mediaQuery.addEventListener('change', handleChange)

            return () => {
                mediaQuery.removeEventListener('change', handleChange)
            }
        } else {
            setResolvedTheme(theme)
        }
    }, [theme])

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement

        if (resolvedTheme === 'dark') {
            root.classList.add('dark')
            root.style.colorScheme = 'dark'
        } else {
            root.classList.remove('dark')
            root.style.colorScheme = 'light'
        }
    }, [resolvedTheme])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        setStorageItem(STORAGE_KEYS.THEME, newTheme)
    }

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
    }

    const value: ThemeContextType = {
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}