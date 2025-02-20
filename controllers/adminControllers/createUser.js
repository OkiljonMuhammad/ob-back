import { generateToken } from '../../utils/jwt.js';
import User from '../../models/User.js';
import AdminLog from '../../models/AdminLog.js';

const DEFAULT_ROLE = 'user';
const DEFAULT_BLOCK_STATUS = false;
const createUser = async (req, res) => {
  try {
    const { username, email, password, role, isBlocked } = req.body;

    const userWithEmail = await User.unscoped().findOne({ where: { email } });
    if (userWithEmail) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists.' });
    }

    const userWithUsername = await User.unscoped().findOne({
      where: { username },
    });
    if (userWithUsername) {
      return res
        .status(400)
        .json({ message: 'User with this username already exists.' });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role: role || DEFAULT_ROLE,
      isBlocked: isBlocked || DEFAULT_BLOCK_STATUS,
    });

    
    const token = generateToken({ id: newUser.id, role: newUser.role });

    if (req.user?.id) {
      await AdminLog.create({
        adminId: req.user.id,
        action: "New user created",
        details: { id: newUser.id, username: newUser.username, role: newUser.role },
      });
    }

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isBlocked: newUser.isBlocked,
      },
    });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default createUser;
