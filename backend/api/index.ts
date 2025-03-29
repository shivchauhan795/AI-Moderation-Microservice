import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
import { config } from 'dotenv';
config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is running!');
})

// Routes
app.use('/api/v1/auth', authRoutes);    // auth routes

app.use('/api/v1/users', userRoutes);   // user routes



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})