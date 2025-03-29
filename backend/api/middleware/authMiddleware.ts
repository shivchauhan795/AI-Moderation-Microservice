import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || "SECRET";

// middleware for authentication checking
export default function middleware(req: any, res: any, next: any) {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
}
