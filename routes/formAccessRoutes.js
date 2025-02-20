import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import grantFormAccess from '../controllers/formAccessControllers/grantFormAccess.js';
import revokeFormAccess from '../controllers/formAccessControllers/revokeFormAccess.js';
import getUsersWithFormAccess from '../controllers/formAccessControllers/getFormAccessors.js';

const router = express.Router();

// POST /api/form/access/:formId - grant form access (admins and owners)
router.post('/:formId', authenticateToken, grantFormAccess);

// GET /api/form/access/:formId - Get all form accessors (admins and owners)
router.get(
  '/:formId',
  authenticateToken,
  getUsersWithFormAccess
);

// DELETE /api/form/access/:formId - revoke form access (admins and owners)
router.delete('/:formId', authenticateToken, revokeFormAccess);

export default router;
