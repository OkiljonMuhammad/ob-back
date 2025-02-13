import express from 'express';
import addTopic from '../controllers/topicControllers/addTopic.js';
import getTopics from '../controllers/topicControllers/getTopics.js';
import {
  authenticateToken,
  authorizeRole,
} from '../middleware/authMiddleware.js';
import 'dotenv/config';

const router = express.Router();
const ADMIN_ROLE = process.env.ADMIN_ROLE;
// POST /api/topic/create - add a new topic (Admin-only)
router.post('/create', authenticateToken, authorizeRole(ADMIN_ROLE), addTopic);

// GET /api/topic/topics - fetch all topics (Public or User-accessible)
router.get('/topics', getTopics);

export default router;
