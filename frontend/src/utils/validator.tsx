import { z } from 'zod';

export const validateLogin = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
})

export const validateSignup = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
    name: z.string().max(30)
})