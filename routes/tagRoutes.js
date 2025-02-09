import express from 'express';
import suggestTags from '../controllers/tagControllers/tagSuggest.js';

const router = express.Router();

// GET /api/tag/suggest - route for tag suggestions
router.get('/suggest', suggestTags);

export default router;