import express from 'express';
import registerUser from '../controllers/authControllers/registerUser.js';
import loginUser from '../controllers/authControllers/loginUser.js';
import updateUser from '../controllers/adminControllers/updateUser.js';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', registerUser);

// PUT /api/auth/update/:userId - Update a user
router.put('/update/:userId', updateUser);

// POST /api/auth/login - Login an existing user
router.post('/login', loginUser);

export default router;
