import express from 'express';
import { signup, login } from '../controllers/authController';
const router = express.Router();

router.post('/signup', signup);         // post endpoint to create a new user

router.post('/login', login);           // post endpoint to login a user

export default router;