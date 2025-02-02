import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";
import getAllUsers from "../controllers/adminControllers/getAllUsers.js";
import getAllTemplates from "../controllers/adminControllers/getAllTemplates.js";
import toggleUserBlock from "../controllers/adminControllers/toggleUserBlock.js";
import toggleUserRole from "../controllers/adminControllers/toggleUserRole.js";
import deleteUser from "../controllers/adminControllers/deleteUser.js";
import hardDeleteUser from "../controllers/adminControllers/hardDeleteUser.js";



const router = express.Router();

// GET /api/admin/users - Get all users (admin-only)
router.get("/users", authenticateToken, authorizeRole("admin"), getAllUsers);

// PATCH /api/admin/users/:userId/block - Block or unblock a user (admin-only)
router.patch("/users/:userId/block", authenticateToken, authorizeRole("admin"), toggleUserBlock);

// PATCH /api/admin/users/:userId/role - Promote or demote a user (admin-only)
router.patch("/users/:userId/role", authenticateToken, authorizeRole("admin"), toggleUserRole);

// PATCH /api/admin/users/:userId/delete - soft delete a user (admin-only)
router.delete("/users/:userId/delete", authenticateToken, authorizeRole("admin"), deleteUser);

// PATCH /api/admin/users/:userId/hardDelete - hard delete a user (admin-only)
router.delete("/users/:userId/hardDelete", authenticateToken, authorizeRole("admin"), hardDeleteUser);

// GET /api/admin/templates - Get all templates (admin-only)
router.get("/templates", authenticateToken, authorizeRole("admin"), getAllTemplates);

export default router;