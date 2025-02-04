import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";
import getAllUsers from "../controllers/adminControllers/getAllUsers.js";
import toggleUserBlock from "../controllers/adminControllers/toggleUserBlock.js";
import toggleUserRole from "../controllers/adminControllers/toggleUserRole.js";
import deleteUser from "../controllers/adminControllers/deleteUser.js";
import hardDeleteUser from "../controllers/adminControllers/hardDeleteUser.js";


const USER_ROLE = "admin";
const router = express.Router();

// GET /api/admin/users - Get all users (admin-only)
router.get("/users", authenticateToken, authorizeRole(USER_ROLE), getAllUsers);

// PATCH /api/admin/users/:userId/block - Block or unblock a user (admin-only)
router.patch("/users/:userId/block", authenticateToken, authorizeRole(USER_ROLE), toggleUserBlock);

// PATCH /api/admin/users/:userId/role - Promote or demote a user (admin-only)
router.patch("/users/:userId/role", authenticateToken, authorizeRole(USER_ROLE), toggleUserRole);

// PATCH /api/admin/users/:userId - soft delete a user (admin-only)
router.delete("/users/:userId", authenticateToken, authorizeRole(USER_ROLE), deleteUser);

// PATCH /api/admin/users/:userId/delete - hard delete a user (admin-only)
router.delete("/users/:userId/delete", authenticateToken, authorizeRole(USER_ROLE), hardDeleteUser);

export default router;