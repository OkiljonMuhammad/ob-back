import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import createTicket from '../controllers/jiraControllers/createTicket.js';
import getTicketsByEmail from '../controllers/jiraControllers/getTicketsByEmail.js';
const router = express.Router();

// POST api/jira/ticket - Create a ticket
router.post('/ticket', authenticateToken, createTicket);

// GET api/jira/tickets - Create a ticket
router.get('/tickets', authenticateToken, getTicketsByEmail);

export default router;
