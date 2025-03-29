import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { post, comment, getPosts, getFlaggedComments, like } from '../controllers/userController';
const router = express.Router();


router.post('/post', authMiddleware, post);         // post endpoint to create a new post

router.post('/comment', authMiddleware, comment);   // post endpoint to create a new comment

router.post('/like', authMiddleware, like);          // post endpoint to like a post

router.get('/posts', authMiddleware, getPosts);     // get endpoint to get all posts

router.get('/flagged-comments', authMiddleware, getFlaggedComments);     // get endpoint to get all flagged comments

export default router;