import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import createComment from "../controllers/commentControllers/createComment.js";
import updateComment from "../controllers/commentControllers/updateComment.js";
import deleteComment from "../controllers/commentControllers/deleteComment.js";
import getTemplateComments from "../controllers/commentControllers/getTemplateComments.js";
import getTemplateCommentCount from "../controllers/commentControllers/getTemplateCommentCount.js";

const router = express.Router();

// POST /api/comment/:templateId - comment a template
router.post("/:templateId", authenticateToken, createComment);

// PUT /api/comment/:commentId - update a comment
router.put("/:commentId", authenticateToken, updateComment);

// DELETE /api/comment/:commentId - Delete a comment
router.delete("/:commentId", authenticateToken, deleteComment);

// GET /api/comment/:templateId/count - get comment count of a template
router.get("/:templateId/count", getTemplateCommentCount);

// GET /api/comment/templateId/comments/ - get all comments of a template
router.get("/:templateId/comments", getTemplateComments);

export default router;