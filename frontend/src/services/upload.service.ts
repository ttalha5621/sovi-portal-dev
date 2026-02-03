import api from './api'
import { showError, showSuccess } from '../utils/helpers'

class UploadService {
    async uploadFile(file: File, type: 'district' | 'sovi-data' = 'sovi-data'): Promise<any> {
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', type)

            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            showSuccess('File uploaded successfully')
            return response.data
        } catch (error) {
            showError('Failed to upload file')
            throw error
        }
    }

    async uploadGeojson(file: File): Promise<any> {
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'geojson')

            const response = await api.post('/upload/geojson', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            showSuccess('GeoJSON uploaded successfully')
            return response.data
        } catch (error) {
            showError('Failed to upload GeoJSON')
            throw error
        }
    }

    async downloadTemplate(type: 'district' | 'sovi-data'): Promise<void> {
        try {
            const response = await api.get(`/templates/${type}`, {
                responseType: 'blob',
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${type}-template.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            showSuccess('Template downloaded successfully')
        } catch (error) {
            showError('Failed to download template')
            throw error
        }
    }

    async exportData(format: 'csv' | 'json' | 'excel', filters?: any): Promise<void> {
        try {
            const response = await api.get(`/export/${format}`, {
                params: filters,
                responseType: 'blob',
            })

            const timestamp = new Date().toISOString().split('T')[0]
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `sovi-data-${timestamp}.${format}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            showSuccess('Data exported successfully')
        } catch (error) {
            showError('Failed to export data')
            throw error
        }
    }

    validateFile(file: File, allowedTypes: string[], maxSize: number): {
        isValid: boolean
        error?: string
    } {
        // Check file type
        const fileType = file.type
        const isValidType = allowedTypes.includes(fileType)

        if (!isValidType) {
            return {
                isValid: false,
                error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
            }
        }

        // Check file size (in MB)
        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > maxSize) {
            return {
                isValid: false,
                error: `File too large. Maximum size: ${maxSize}MB`,
            }
        }

        return { isValid: true }
    }

    parseCSV(csvText: string): any[] {
        const lines = csvText.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())

        const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim())
            const row: any = {}

            headers.forEach((header, index) => {
                let value: any = values[index] || ''

                // Try to parse numbers
                if (!isNaN(Number(value)) && value !== '') {
                    value = Number(value)
                }

                // Try to parse booleans
                if (value === 'true' || value === 'false') {
                    value = value === 'true'
                }

                // Handle empty strings
                if (value === '') {
                    value = undefined
                }

                row[header] = value
            })

            return row
        })

        return data.filter(row => Object.keys(row).length > 0)
    }

    readFileAsText(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = (event) => {
                resolve(event.target?.result as string)
            }

            reader.onerror = (error) => {
                reject(error)
            }

            reader.readAsText(file)
        })
    }

    async previewFile(file: File, maxRows: number = 10): Promise<any[]> {
        const text = await this.readFileAsText(file)

        if (file.name.endsWith('.csv')) {
            const data = this.parseCSV(text)
            return data.slice(0, maxRows)
        } else if (file.name.endsWith('.json')) {
            const data = JSON.parse(text)
            return Array.isArray(data) ? data.slice(0, maxRows) : [data]
        }

        throw new Error('Unsupported file format')
    }
}

export default new UploadService()