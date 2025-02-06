import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import getTemplates from '../controllers/templateControllers/getTemplates.js';
import createTemplate from '../controllers/templateControllers/createTemplate.js';
import updateTemplate from '../controllers/templateControllers/updateTemplate.js';
import deleteTemplate from '../controllers/templateControllers/deleteTemplate.js';
import { getSingleTemplate } from '../controllers/templateControllers/getSingleTemplate.js';

const router = express.Router();

// GET /api/template/templates - Get all templates (admins and owners)
router.get('/templates', authenticateToken, getTemplates);

// GET /api/template/public - Get all public templates (unauthorized users)
router.get('/public', getTemplates);

// GET /api/template/:templateId - Get all templates (admins and owners)
router.get('/:templateId', authenticateToken, getSingleTemplate);

// GET /api/template/public/:templateId - Get all public templates (unauthorized users)
router.get('/public/:templateId', getSingleTemplate);

// POST /api/template/create - Create a template
router.post('/create', authenticateToken, createTemplate);

// PUT /api/template/:templateId - update a template
router.put('/:templateId', authenticateToken, updateTemplate);

// DELETE /api/template/:templateId - Delete a template
router.delete('/:templateId', authenticateToken, deleteTemplate);

export default router;
