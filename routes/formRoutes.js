import express from "express";
import submitForm from "../controllers/formControllers/submitForm";
import getForms from "../controllers/formControllers/getForms";
import getSingleForm from "../controllers/formControllers/getSingleForm";
import deleteForm from "../controllers/formControllers/deleteForm";

const router = express.Router();

// POST /api/form/submit - Submit a form
router.post("/submit", submitForm);

// GET /api/form/:templateId - Get all forms for a specific template
router.get("/:templateId/forms", getForms);

// GET /api/form/:formId - Get a single form
router.get("/:formId", getSingleForm);

// DELETE /api/form/:formId - Delete a form
router.delete("/:formId", deleteForm);

export default router;