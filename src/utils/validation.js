import { z } from 'zod';

export const contactSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
    email: z
        .string()
        .email('Please enter a valid email address')
        .max(254, 'Email must be less than 254 characters'),
    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message must be less than 2000 characters'),
});

export const reviewSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
    company: z
        .string()
        .min(2, 'Company must be at least 2 characters')
        .max(100, 'Company must be less than 100 characters'),
    rating: z
        .number()
        .min(0.5, 'Rating must be at least 0.5')
        .max(5, 'Rating must be at most 5'),
    message: z
        .string()
        .min(10, 'Review must be at least 10 characters')
        .max(1000, 'Review must be less than 1000 characters'),
});
