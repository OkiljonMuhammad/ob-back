import { generateToken } from '../../utils/jwt.js';
import User from '../../models/User.js';

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.unscoped().findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: 'Your account has been blocked.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.status(200).json({
      message: 'Login successfull',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default loginUser;
