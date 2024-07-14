import {z} from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(100),
    password: z.string().min(6).max(100)
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
});