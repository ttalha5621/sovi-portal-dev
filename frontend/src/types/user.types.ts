export interface User {
    id: number
    email: string
    name: string
    role: 'ADMIN' | 'USER'
    createdAt: string
    updatedAt: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest extends LoginRequest {
    name: string
    role?: 'ADMIN' | 'USER'
}

export interface AuthResponse {
    token: string
    user: User
}

export interface UpdateProfileRequest {
    name?: string
    email?: string
}

export interface ChangePasswordRequest {
    oldPassword: string
    newPassword: string
}