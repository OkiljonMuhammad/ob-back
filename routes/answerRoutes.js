import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createAnswers } from '../controllers/answerControllers/createAnswer.js';
import getAnswers from '../controllers/answerControllers/getAnswers.js';
import getUserResponses from '../controllers/answerControllers/getUserResponses.js';
import deleteUserAnswers from '../controllers/answerControllers/deleteUserAnswers.js';

const router = express.Router();

// POST /api/answer/create - Create answers
router.post('/create', authenticateToken, createAnswers);

// GET /api/answer/answers/:formId - Get answers
router.get('/answers/:formId', authenticateToken, getAnswers);

// GET /api/answer/user/:formId/:userId - Get answers of a single user
router.get('/user/:formId/:userId', authenticateToken, getUserResponses);

// DELETE /api/answer/user/:formId/:userId - Get answers of a single user
router.delete('/user/:formId/:userId', authenticateToken, deleteUserAnswers);

export default router;
