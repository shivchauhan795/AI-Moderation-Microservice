import checkModeration from "../moderator/moderator";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a new post
export const post = async (req: any, res: any) => {
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
}

// Create a new comment
export const comment = async (req: any, res: any) => {
    try {
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
}

export const like = async (req: any, res: any) => {
    try {
        const { postId } = req.body;
        const userId = req.user.id;



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

        const alreadyLiked = await prisma.likes.findFirst({
            where: {
                post: {
                    id: postId
                },
                user: {
                    id: userId
                }
            }
        })
        if (alreadyLiked) {
            //  unlike it
            await prisma.likes.delete({
                where: {
                    id: alreadyLiked.id
                }
            })
            res.status(201).json({ message: "Post Unliked Successfully!" });
            return;
        } else {
            await prisma.likes.create({
                data: {
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
                }
            })
            res.status(201).json({ message: "Liked successfully!" });
        }


    } catch (e) {
        res.status(500).json({ message: 'Internal server error', e });
    }
}

// Get all posts
export const getPosts = async (req: any, res: any) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                comments: {
                    include: {
                        user: true
                    }
                },
                likes: {
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
}

// Get all flagged comments - currently not in used
export const getFlaggedComments = async (req: any, res: any) => {
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
}