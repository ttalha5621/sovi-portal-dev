export interface User {
    id: number;
    email: string;
    name: string | null;
    role: 'ADMIN' | 'USER';
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserInput {
    email: string;
    password: string;
    name?: string;
    role?: 'ADMIN' | 'USER';
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: Omit<User, 'password'>;
}

export interface TokenPayload {
    userId: number;
    email: string;
    role: 'ADMIN' | 'USER';
    iat?: number;
    exp?: number;
}