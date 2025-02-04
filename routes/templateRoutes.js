import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import getAllTemplates from "../controllers/templateControllers/getAllTemplates.js";
import createTemplate from "../controllers/templateControllers/createTemplate.js";
import updateTemplate from "../controllers/templateControllers/updateTemplate.js";
import deleteTemplate from "../controllers/templateControllers/deleteTemplate.js";
import likeTemplate from "../controllers/templateControllers/likeTemplate.js";
import removeLike from "../controllers/templateControllers/removeLike.js";
import getTemplateLikeCount from "../controllers/templateControllers/getTemplateLikeCount.js";
import getTemplateLikes from "../controllers/templateControllers/getTemplateLikes.js";

const router = express.Router();

// GET /api/template/templates - Get all templates (admins and owners)
router.get("/templates", authenticateToken, getAllTemplates);

// GET /api/template/public - Get all public templates (unauthorized users)
router.get("/public", getAllTemplates);

// POST /api/template/create - Create a template
router.post("/create", authenticateToken, createTemplate);

// PUT /api/template/:templateId - update a template
router.put("/:templateId", authenticateToken, updateTemplate);

// DELETE /api/template/:templateId - Delete a template
router.delete("/:templateId", authenticateToken, deleteTemplate);

// POST /api/template/:templateId/like - like a template
router.post("/:templateId/like", authenticateToken, likeTemplate);

// DELETE /api/template/:templateId/like - Delete a template
router.delete("/:templateId/like", authenticateToken, removeLike);

// GET /api/template/:templateId/like/count - get like count of a template
router.get("/:templateId/like/count", authenticateToken, getTemplateLikeCount);

// GET /api/template/likes/ - get like count of a template
router.get("/:templateId/likes", authenticateToken, getTemplateLikes);
export default router;