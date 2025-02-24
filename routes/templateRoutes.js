import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import getTemplates from '../controllers/templateControllers/getTemplates.js';
import createTemplate from '../controllers/templateControllers/createTemplate.js';
import updateTemplate from '../controllers/templateControllers/updateTemplate.js';
import deleteTemplate from '../controllers/templateControllers/deleteTemplate.js';
import { getSingleTemplate } from '../controllers/templateControllers/getSingleTemplate.js';
import getPopularTemplates from '../controllers/templateControllers/getPopularTemplates.js';
import templateResults from '../controllers/templateControllers/templateResults.js'
const router = express.Router();

// GET /api/template/templates - Get all templates (admins and owners)
router.get('/templates', authenticateToken, getTemplates);

// GET /api/template/templates/public - Get all public templates (all users)
router.get('/templates/public', getTemplates);

// GET /api/template/templates/popular - Get top popular templates (all users)
router.get('/templates/popular', getPopularTemplates);

// GET /api/template/:templateId - Get a template (admins and owners)
router.get('/:templateId', authenticateToken, getSingleTemplate);

// GET /api/template/aggregation/:templateId - Get a template (admins and owners)
router.get('/aggregation/:templateId', authenticateToken,templateResults);

// GET /api/template/public/:templateId - Get public template (unauthorized users)
router.get('/public/:templateId', getSingleTemplate);

// POST /api/template/create - Create a template
router.post('/create', authenticateToken, createTemplate);

// PUT /api/template/:templateId - update a template
router.put('/:templateId', authenticateToken, updateTemplate);

// DELETE /api/template/:templateId - Delete a template
router.delete('/:templateId', authenticateToken, deleteTemplate);

export default router;
