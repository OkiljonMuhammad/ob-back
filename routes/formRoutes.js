import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import submitForm from '../controllers/formControllers/submitForm.js';
import getSingleForm from '../controllers/formControllers/getSingleForm.js';
import deleteForm from '../controllers/formControllers/deleteForm.js';
import createForm from '../controllers/formControllers/createForm.js';
import getAllForms from '../controllers/formControllers/getAllForms.js';
const router = express.Router();

// POST /api/form/create - Create a form
router.post('/create', authenticateToken, createForm);

// POST /api/form/submit - Submit a form
router.post('/submit', authenticateToken, submitForm);

// GET /api/form/forms - Get all forms
router.get('/forms', authenticateToken, getAllForms);

// GET /api/form/:formId - Get a single form
router.get('/:formId', authenticateToken, getSingleForm);

// DELETE /api/form/:formId - Delete a form
router.delete('/:formId', authenticateToken, deleteForm);

export default router;
