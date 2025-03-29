import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validateUserSignup, validateUserLogin } from "./validate/validator";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

config();

const app = express();

app.use(express.json());
app.use(cors());

const jwtSecret = process.env.JWT_SECRET || "SECRET";

// moderation checking function
async function checkModeration(content: string) {
    try {
        const response = fetch(`https://api1.webpurify.com/services/rest/?method=webpurify.live.check&api_key=${process.env.MODERATION_KEY}&text=${content}&format=json`)

        const data = await (await response).json();
        return data.rsp.found !== "0";  //bad word found

    } catch (e) {
        console.log(e);
        return false;
    }
}

// middleware for authentication checking
function middleware(req: any, res: any, next: any) {
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

// basic endpoint
app.get('/', (req, res) => {
    res.send('Server is running!');
})

// signup endpoint
app.post('/signup', async (req, res) => {
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
})

// login endpoint
app.post('/login', async (req, res) => {
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
})

// post endpoint for posting a post
app.post('/post', middleware, async (req: any, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;

        const user = await prisma.user.findFirst({ where: { id: userId } });
        if (!user) {
            res.status(400).json({ error: "User not found!" });
            return;
        }

        const post = await prisma.post.create({
            data: {
                content,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });

        res.status(201).json({ message: "Post created successfully!", post });

    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

// post endpoint for posting a comment
app.post('/comment', middleware, async (req: any, res) => {
    try {
        console.log(req.body);
        const { content, postId } = req.body;
        const userId = req.user.id;

        const flagged = await checkModeration(content);

        const user = await prisma.user.findFirst({ where: { id: userId } });
        if (!user) {
            res.status(400).json({ error: "User not found!" });
            return;
        }

        const post = await prisma.post.findFirst({ where: { id: postId } });
        if (!post) {
            res.status(400).json({ error: "Post not found!" });
            return;
        }

        if (flagged) {
            const comment = await prisma.comments.create({
                data: {
                    content,
                    post: {
                        connect: {
                            id: postId
                        }
                    },
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    flaged: true
                }
            })
            res.status(201).json({ message: "Comment flagged for moderation!", comment });

        } else {
            const comment = await prisma.comments.create({
                data: {
                    content,
                    post: {
                        connect: {
                            id: postId
                        }
                    },
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    flaged: false
                }
            })
            res.status(201).json({ message: "Comment created successfully!", comment });
        }

    } catch (e) {
        res.status(500).json({ message: 'Internal server error', e });
    }
})

// get endpoint for getting all posts with comments
app.get('/posts', middleware, async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                comments: {
                    include: {
                        user: true
                    }
                },
                user: true
            }
        });
        res.status(200).json({ posts });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

// get endpoint for getting all flagged comments
app.get('/flagged-comments', middleware, async (req, res) => {
    try {
        const comments = await prisma.comments.findMany({
            where: {
                flaged: true
            }
        });
        res.status(200).json({ comments });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})