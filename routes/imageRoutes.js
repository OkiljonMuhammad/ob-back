import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import uploadImageToImgur from '../controllers/imageControllers/uploadImage.js';

const router = express.Router();

// POST /api/image/upload - upload an image
router.post('/upload', authenticateToken,  uploadImageToImgur);


export default router;
