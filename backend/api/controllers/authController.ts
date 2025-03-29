import { validateUserSignup, validateUserLogin } from "../validator/validator";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const jwtSecret = process.env.JWT_SECRET || "SECRET";


// signup
export const signup = async (req: any, res: any) => {
    try {
        const { email, password, name } = req.body;

        const validation = validateUserSignup.safeParse({ email, password, name });

        if (!validation.success) {
            res.status(400).json({ error: "Data is not valid!" });
            return;
        }

        const userExists = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (userExists) {
            res.status(400).json({ error: "User already exists!" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        res.status(201).json({ message: "User created successfully!" });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// login
export const login = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        const validation = validateUserLogin.safeParse({ email, password });

        if (!validation.success) {
            res.status(400).json({ error: "Data is not valid!" });
            return;
        }

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            res.status(400).json({ error: "User not found!" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(400).json({ error: "Invalid password!" });
            return;
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1d' });

        res.status(200).json({ message: "Logged in successfully!", token });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
}