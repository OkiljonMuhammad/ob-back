import express from 'express';
import {
  authenticateToken,
  authorizeRole,
} from '../middleware/authMiddleware.js';
import getAllUsers from '../controllers/adminControllers/getAllUsers.js';
import toggleUserBlock from '../controllers/adminControllers/toggleUserBlock.js';
import toggleUserRole from '../controllers/adminControllers/toggleUserRole.js';
import deleteUser from '../controllers/adminControllers/deleteUser.js';
import hardDeleteUser from '../controllers/adminControllers/hardDeleteUser.js';
import getRoles from '../controllers/adminControllers/getUserRoles.js';
import getSingleUser from '../controllers/adminControllers/getSingleUser.js';
import createUser from '../controllers/adminControllers/createUser.js';
import updateUser from '../controllers/adminControllers/updateUser.js';
import 'dotenv/config';

const ADMIN_ROLE = process.env.ADMIN_ROLE;
const router = express.Router();

// POST /api/admin/user/create - Create new user (admin-only)
router.post('/user/create', authenticateToken, authorizeRole(ADMIN_ROLE), createUser);

// GET /api/admin/users - Get all users (admin-only)
router.get('/users', authenticateToken, authorizeRole(ADMIN_ROLE), getAllUsers);

// GET /api/admin/user/:userId - Get single user (admin-only)
router.get('/user/:userId', authenticateToken, authorizeRole(ADMIN_ROLE), getSingleUser);

// PUT /api/admin/update/:userId - Update a user
router.put('/update/:userId', authenticateToken, authorizeRole(ADMIN_ROLE), updateUser);
// PATCH /api/admin/user/block/:userId - Block or unblock a user (admin-only)
router.patch('/user/block/:userId', authenticateToken, authorizeRole(ADMIN_ROLE), toggleUserBlock);

// PATCH /api/admin/users/:userId/role - Promote or demote a user (admin-only)
router.patch('/users/:userId/role', authenticateToken, authorizeRole(ADMIN_ROLE), toggleUserRole);

// DELETE /api/admin/users/:userId - hard delete a user (admin-only)
router.delete('/users/:userId', authenticateToken, authorizeRole(ADMIN_ROLE), hardDeleteUser);

// DELETE /api/admin/users/:userId/soft - soft delete a user (admin-only)
router.delete('/users/soft/:userId', authenticateToken, authorizeRole(ADMIN_ROLE),deleteUser);


// GET /api/admin/roles - Get all user roles (admin-only)
router.get('/roles', authenticateToken, authorizeRole(ADMIN_ROLE), getRoles);

export default router;
