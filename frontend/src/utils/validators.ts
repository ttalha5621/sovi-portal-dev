import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters')
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100)

// Auth validators
export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

export const registerSchema = loginSchema.extend({
    name: nameSchema,
    role: z.enum(['ADMIN', 'USER']).optional(),
})

export const updateProfileSchema = z.object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
})

export const changePasswordSchema = z.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
}).refine(data => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from old password',
    path: ['newPassword'],
})

// District validators
export const districtSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    fid: z.string().optional(),
    division: z.string().max(50).optional(),
    province: z.string().max(50).optional(),
    country: z.string().default('Pakistan'),
})

// SoVI data validators
export const soviDataSchema = z.object({
    districtId: z.number().int().positive('District ID is required'),
    year: z.number().int().min(2000).max(2100),

    // Education fields
    NOSCL: z.number().min(0).max(100).optional(),
    PRIMSC: z.number().min(0).max(100).optional(),
    ENRLPR: z.number().min(0).max(100).optional(),
    ENRMA: z.number().min(0).max(100).optional(),
    PATS: z.number().min(0).max(100).optional(),
    ADLLIT: z.number().min(0).max(100).optional(),

    // Health fields
    DIARR: z.number().min(0).max(100).optional(),
    IMMUN: z.number().min(0).max(100).optional(),
    WTTI: z.number().min(0).max(100).optional(),
    CbyladyH_W_PRE: z.number().min(0).max(100).optional(),
    CbyladyH_W_POST: z.number().min(0).max(100).optional(),
    PNCONSL: z.number().min(0).max(100).optional(),
    FERTILITY: z.number().min(0).max(10).optional(),
    CHDISABL: z.number().min(0).max(100).optional(),

    // Facility fields
    TENURE: z.number().min(0).max(100).optional(),
    ROOMS: z.number().min(0).max(10).optional(),
    ELECTRIC: z.number().min(0).max(100).optional(),
    TAPWATER: z.number().min(0).max(100).optional(),
    MEDIA: z.number().min(0).max(100).optional(),
    INTERNET: z.number().min(0).max(100).optional(),

    // Economic fields
    QAGRI: z.number().min(0).max(100).optional(),
    REMITT: z.number().min(0).max(100).optional(),
    ECoH: z.number().min(0).max(100).optional(),
    BHU_F: z.number().min(0).max(100).optional(),
    Fmly_P: z.number().min(0).max(100).optional(),
    Sch_F: z.number().min(0).max(100).optional(),
    Vat_F: z.number().min(0).max(100).optional(),
    Agro_F: z.number().min(0).max(100).optional(),
    Pol_F: z.number().min(0).max(100).optional(),

    // Population fields
    QOLD: z.number().min(0).max(100).optional(),
    QMID: z.number().min(0).max(100).optional(),
    Fpop: z.number().min(0).max(100).optional(),
    Rpop: z.number().min(0).max(100).optional(),
    Upop: z.number().min(0).max(100).optional(),
    QKIDS: z.number().min(0).max(100).optional(),
    Growth_Rate: z.number().min(-10).max(10).optional(),
})

// Validation functions
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
    return password.length >= 6
}

export function validateName(name: string): boolean {
    return name.length >= 2 && name.length <= 100
}

export function validateNumber(value: string, min: number = 0, max: number = 100): boolean {
    const num = parseFloat(value)
    return !isNaN(num) && num >= min && num <= max
}

export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/<[^>]*>/g, '')
        .replace(/[<>]/g, '')
}

// Form validation helper
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
    isValid: boolean
    errors: Record<string, string>
    validatedData: T | null
} {
    try {
        const validatedData = schema.parse(data)
        return {
            isValid: true,
            errors: {},
            validatedData,
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {}
            error.errors.forEach(err => {
                if (err.path.length > 0) {
                    errors[err.path.join('.')] = err.message
                }
            })
            return {
                isValid: false,
                errors,
                validatedData: null,
            }
        }
        return {
            isValid: false,
            errors: { _form: 'Validation failed' },
            validatedData: null,
        }
    }
}