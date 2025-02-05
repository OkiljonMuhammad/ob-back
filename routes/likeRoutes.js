import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import getTemplateLikeCount from "../controllers/likeControllers/getTemplateLikeCount.js";
import likeTemplate from "../controllers/likeControllers/likeTemplate.js";
import getTemplateLikes from "../controllers/likeControllers/getTemplateLikes.js";
import removeLike from "../controllers/likeControllers/removeLike.js";

const router = express.Router();

// POST /api/like/:templateId - like a template
router.post("/:templateId", authenticateToken, likeTemplate);

// DELETE /api/like/:templateId - Delete a like
router.delete("/:templateId", authenticateToken, removeLike);

// GET /api/like/:templateId/count - get like count of a template
router.get("/:templateId/count", authenticateToken, getTemplateLikeCount);

// GET /api/like/:templateId/likes - get like count of a template
router.get("/:templateId/likes", authenticateToken, getTemplateLikes);

export default router;