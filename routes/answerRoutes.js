import express from 'express';
import { createAnswers } from '../controllers/answerControllers.js/createAnswer.js';

const router = express.Router();

// POST /api/answer/create - Create answers
router.post('/create', createAnswers);

export default router;
