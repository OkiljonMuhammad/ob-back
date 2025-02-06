import express from 'express';
import registerUser from '../controllers/authControllers/registerUser.js';
import loginUser from '../controllers/authControllers/loginUser.js';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', registerUser);

// POST /api/auth/login - Login an existing user
router.post('/login', loginUser);

export default router;
