import {z} from 'zod';

export const userUpdateSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().min(3).max(100).optional(),
    lastPassword: z.string().min(6).max(100).optional(),
    newPassword: z.string().min(6).max(100).optional()
});