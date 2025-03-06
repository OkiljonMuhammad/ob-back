import express from 'express';
import registerUser from '../controllers/authControllers/registerUser.js';
import loginUser from '../controllers/authControllers/loginUser.js';
import updateUser from '../controllers/adminControllers/updateUser.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import generateApiToken from '../controllers/authControllers/generateApiToken.js';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', registerUser);

// POST /api/auth/apitoken - Generate a new api token
router.post('/apitoken', authenticateToken, generateApiToken);

// PUT /api/auth/update/:userId - Update a user
router.put('/update/:userId', updateUser);

// POST /api/auth/login - Login an existing user
router.post('/login', loginUser);

export default router;
