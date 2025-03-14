import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import rateLimiter from './middleware/rateLimiter.js';
import commentRoutes from './routes/commentRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import formAccessRoutes from './routes/formAccessRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import formRoutes from './routes/formRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import answerRoutes from './routes/answerRoutes.js';
import imageRoutes from './routes/imageRoutes.js'
import jiraRoutes from './routes/jiraRoutes.js'
import presentationRoutes from './routes/presentationRoutes/presentationRoutes.js';
import participantRoutes from './routes/presentationRoutes/participantRoutes.js';


const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN, process.env.LOCAL_HOST],
    methods: "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(rateLimiter);

// Form Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/form/access', formAccessRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/form', formRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/topic', topicRoutes);
app.use('/api/answer', answerRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/jira', jiraRoutes);

// Slide Routes
app.use('/api/presentation', presentationRoutes);
app.use('/api/participant', participantRoutes);


export default app;
