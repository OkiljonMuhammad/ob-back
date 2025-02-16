import express from 'express';
import suggestTags from '../controllers/tagControllers/tagSuggest.js';
import getTags from '../controllers/tagControllers/getTags.js';
const router = express.Router();

// GET /api/tag/suggest - route for tag suggestions
router.get('/suggest', suggestTags);

// GET /api/tag/tags - route for fetch tags
router.get('/tags', getTags);

export default router;
