import { z } from "zod";

export const validateUserSignup = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
    name: z.string().max(30)
})


export const validateUserLogin = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
})