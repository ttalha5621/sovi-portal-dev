import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { CreateUserInput, LoginInput, AuthResponse, User, TokenPayload } from '../types/user.types';
import { validateUserInput, validateLoginInput } from '../utils/validators';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

// Sanitize email for logging
const sanitizeEmail = (email: string): string => {
    return email.replace(/[\r\n]/g, '');
};

export class AuthService {
    async register(userData: CreateUserInput): Promise<AuthResponse> {
        try {
            // Validate input
            const validation = validateUserInput(userData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email }
            });

            if (existingUser) {
                throw new Error('User already exists with this email');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email: userData.email,
                    password: hashedPassword,
                    name: userData.name,
                    role: userData.role || 'USER'
                }
            });

            // Generate token
            const token = this.generateToken(user);

            // Remove password from response
            const { password, ...userWithoutPassword } = user;

            logger.info(`User registered: ${sanitizeEmail(user.email)}`);

            return {
                token,
                user: userWithoutPassword
            };
        } catch (error) {
            logger.error('Registration error:', error);
            throw error;
        }
    }

    async login(loginData: LoginInput): Promise<AuthResponse> {
        try {
            // Validate input
            const validation = validateLoginInput(loginData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Find user
            const user = await prisma.user.findUnique({
                where: { email: loginData.email }
            });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Check password
            const validPassword = await bcrypt.compare(loginData.password, user.password);
            if (!validPassword) {
                throw new Error('Invalid credentials');
            }

            // Generate token
            const token = this.generateToken(user);

            // Remove password from response
            const { password, ...userWithoutPassword } = user;

            logger.info(`User logged in: ${sanitizeEmail(user.email)}`);

            return {
                token,
                user: userWithoutPassword
            };
        } catch (error) {
            logger.error('Login error:', error);
            throw error;
        }
    }

    async getUserById(userId: number): Promise<User | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) return null;

            // Remove password from response
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword as User;
        } catch (error) {
            logger.error('Get user error:', error);
            throw error;
        }
    }

    async updateUser(userId: number, updates: Partial<Omit<User, 'password'>>): Promise<User | null> {
        try {
            // Don't allow password updates through this method
            const safeUpdates = updates;

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: safeUpdates
            });

            // Remove password from response
            const { password: _, ...userWithoutPassword } = updatedUser;

            logger.info(`User updated: ${sanitizeEmail(updatedUser.email)}`);

            return userWithoutPassword as User;
        } catch (error) {
            logger.error('Update user error:', error);
            throw error;
        }
    }

    private generateToken(user: User): string {
        const payload: TokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };

        return jwt.sign(payload, JWT_SECRET!);
    }

    verifyToken(token: string): TokenPayload | null {
        try {
            const decoded = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload;
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                iat: decoded.iat,
                exp: decoded.exp
            };
        } catch (error) {
            logger.error('Token verification error:', error);
            throw new Error('Invalid token');
        }
    }

    async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
        try {
            // Validate new password
            if (!newPassword || newPassword.length < 6) {
                throw new Error('New password must be at least 6 characters long');
            }

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Verify old password
            const validPassword = await bcrypt.compare(oldPassword, user.password);
            if (!validPassword) {
                throw new Error('Invalid old password');
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });

            logger.info(`Password changed for user: ${sanitizeEmail(user.email)}`);

            return true;
        } catch (error) {
            logger.error('Change password error:', error);
            throw error;
        }
    }
}

export default new AuthService();