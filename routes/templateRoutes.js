import express from "express";
import getAllTemplates from "../controllers/templateControllers/getAllTemplates.js";

const router = express.Router();

// GET /api/templates - Get all templates
router.get("/templates", getAllTemplates);

export default router;