import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import getProfile  from "../controllers/profileController.js";

const router = express.Router();

// GET /api/profile - Get the authenticated user's profile
router.get("/profile", authenticateToken, getProfile);

export default router;