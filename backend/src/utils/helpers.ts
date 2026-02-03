import { Request } from 'express';
import { TokenPayload } from '../types/user.types';

export function getPaginationParams(req: Request): { page: number; limit: number } {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  
  return { page, limit };
}

export function getYearParam(req: Request): number | undefined {
  const year = parseInt(req.query.year as string);
  return isNaN(year) ? undefined : year;
}

export function formatResponse<T>(
  data: T,
  message: string = 'Success',
  success: boolean = true
): { success: boolean; message: string; data: T } {
  return {
    success,
    message,
    data
  };
}

export function formatErrorResponse(
  message: string = 'An error occurred',
  errors: string[] = []
): { success: boolean; message: string; errors: string[] } {
  return {
    success: false,
    message,
    errors
  };
}

export function extractTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const [bearer, token] = authHeader.split(' ');
  return bearer === 'Bearer' ? token : null;
}

export function getUserFromRequest(req: Request): TokenPayload | null {
  return (req as any).user || null;
}

export function isAdminUser(req: Request): boolean {
  const user = getUserFromRequest(req);
  return user?.role === 'ADMIN';
}

export function generateDistrictCode(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}