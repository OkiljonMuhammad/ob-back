import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import getAllTemplates from "../controllers/templateControllers/getAllTemplates.js";
import createTemplate from "../controllers/templateControllers/createTemplate.js";
import updateTemplate from "../controllers/templateControllers/updateTemplate.js";
import deleteTemplate from "../controllers/templateControllers/deleteTemplate.js";

const router = express.Router();

// GET /api/template/templates - Get all templates
router.get("/templates", authenticateToken, getAllTemplates);

// POST /api/template/create - Create a template
router.post("/create", authenticateToken, createTemplate);

// PUT /api/template/:templateId - update a template
router.put("/:templateId", authenticateToken, updateTemplate);

// DELETE /api/template/:templateId - Delete a template
router.delete("/:templateId", authenticateToken, deleteTemplate);

export default router;