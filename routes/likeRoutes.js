import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import getTemplateLikeCount from '../controllers/likeControllers/getTemplateLikeCount.js';
import likeTemplate from '../controllers/likeControllers/likeTemplate.js';
import getTemplateLikes from '../controllers/likeControllers/getTemplateLikes.js';
import removeLike from '../controllers/likeControllers/removeLike.js';
import CheckLikeTemplate from '../controllers/likeControllers/checkTemplateLike.js';

const router = express.Router();

// POST /api/like/:templateId - like a template
router.post('/:templateId', authenticateToken, likeTemplate);

// DELETE /api/like/:templateId - Delete a like
router.delete('/:templateId', authenticateToken, removeLike);

// GET /api/like/count/:templateId/ - get like count of a template
router.get('/count/:templateId', getTemplateLikeCount);

// GET /api/like/:templateId/ - get like count of a template
router.get('/:templateId', authenticateToken, CheckLikeTemplate);

// GET /api/like/:templateId/likes - get likes of a template (admins and owners)
router.get('/:templateId/likes', authenticateToken, getTemplateLikes);

export default router;
