import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import submitForm from "../controllers/formControllers/submitForm.js";
import getForms from "../controllers/formControllers/getForms.js";
import getSingleForm from "../controllers/formControllers/getSingleForm.js";
import deleteForm from "../controllers/formControllers/deleteForm.js";

const router = express.Router();

// POST /api/form/submit - Submit a form
router.post("/submit", authenticateToken, submitForm);

// GET /api/form/:templateId - Get all forms for a specific template
router.get("/:templateId/forms", authenticateToken, getForms);

// GET /api/form/:formId - Get a single form
router.get("/:formId", authenticateToken, getSingleForm);

// DELETE /api/form/:formId - Delete a form
router.delete("/:formId", authenticateToken, deleteForm);

export default router;