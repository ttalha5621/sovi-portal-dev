import { CreateUserInput, LoginInput } from '../types/user.types';
import { CreateDistrictInput, UpdateDistrictInput } from '../types/district.types';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function validateUserInput(input: CreateUserInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.email) {
    errors.push('Email is required');
  } else if (!validateEmail(input.email)) {
    errors.push('Invalid email format');
  }

  if (!input.password) {
    errors.push('Password is required');
  } else if (!validatePassword(input.password)) {
    errors.push('Password must be at least 6 characters long');
  }

  if (input.name && input.name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateLoginInput(input: LoginInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.email) {
    errors.push('Email is required');
  }

  if (!input.password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateDistrictInput(input: CreateDistrictInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length === 0) {
    errors.push('District name is required');
  }

  if (input.name && input.name.length > 100) {
    errors.push('District name must be less than 100 characters');
  }

  if (input.province && input.province.length > 50) {
    errors.push('Province name must be less than 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateUpdateDistrictInput(input: UpdateDistrictInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (input.name !== undefined) {
    if (input.name.trim().length === 0) {
      errors.push('District name cannot be empty');
    }
    if (input.name.length > 100) {
      errors.push('District name must be less than 100 characters');
    }
  }

  if (input.province && input.province.length > 50) {
    errors.push('Province name must be less than 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, ''); // Remove angle brackets
}