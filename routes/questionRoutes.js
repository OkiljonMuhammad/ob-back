import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import addQuestions from '../controllers/questionControllers/addQuestion.js';
import getSingleQuestion from '../controllers/questionControllers/getSingleQuestion.js';
import updateQuestion from '../controllers/questionControllers/updateQuestion.js';
import updateQuestionOrder from '../controllers/questionControllers/updateQuestionOrder.js';
import deleteQuestion from '../controllers/questionControllers/deleteQuestion.js';
import getQuestions from '../controllers/questionControllers/getQuestions.js';

const router = express.Router();

// GET /api/question/questions/:templateId - Get all questions
router.get('/questions/:templateId', authenticateToken, getQuestions);

// GET /api/question/:questionId - Get a single question
router.get('/:questionId', authenticateToken, getSingleQuestion);

// POST /api/question/:templateId - Create question/questions
router.post('/:templateId', authenticateToken, addQuestions);

// PUT /api/question/:questionId - update a question
router.put('/:questionId', authenticateToken, updateQuestion);

// PUT /api/question/order - update question order
router.put('/order', authenticateToken, updateQuestionOrder);

// DELETE /api/question/:questionId - Delete a question
router.delete('/:questionId', authenticateToken, deleteQuestion);

export default router;
