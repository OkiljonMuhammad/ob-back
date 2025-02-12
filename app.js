import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import rateLimiter from './middleware/rateLimiter.js';
import commentRoutes from './routes/commentRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import templateAccessRoutes from './routes/templateAccessRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import formRoutes from './routes/formRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/template', templateAccessRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/form', formRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/topic', topicRoutes);

export default app;
