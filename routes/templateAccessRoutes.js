import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import grantTemplateAccess from "../controllers/templateAccessControllers/grantTemplateAccess.js";
import revokeTemplateAccess from "../controllers/templateAccessControllers/revokeTemplateAccess.js";
import getUsersWithTemplateAccess from "../controllers/templateAccessControllers/getTemplateAccessors.js";

const router = express.Router();

// POST /api/template/:templateId/access - grant template access (admins and owners)
router.post("/:templateId/access", authenticateToken, grantTemplateAccess);

// GET /api/template/:templateId/accessors - Get all template accessors (admins and owners)
router.get("/:templateId/accessors", authenticateToken, getUsersWithTemplateAccess);

// DELETE /api/template/:templateId/access - revoke template access (admins and owners)
router.delete("/:templateId/access", authenticateToken, revokeTemplateAccess);

export default router;