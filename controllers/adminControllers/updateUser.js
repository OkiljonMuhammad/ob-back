import User from '../../models/User.js';
import { generateToken } from '../../utils/jwt.js';
import AdminLog from '../../models/AdminLog.js';

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, password, role, isBlocked } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingEmail = await User.unscoped().findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    if (username && username !== user.username) {
      const existingUsername = await User.unscoped().findOne({
        where: { username },
      });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username is already in use' });
      }
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      password: password || user.password,
      role: role || user.role,
      isBlocked: isBlocked !== undefined ? isBlocked : user.isBlocked,
    });

    let token = null;
    if (role && role !== user.role) {
      token = generateToken({ id: user.id, role: user.role });
    }

    if (req.user?.id) {
      await AdminLog.create({
        adminId: req.user.id,
        action: `Updated user credentials ${userId}`,
        details: { id: user.id, username: user.username, role: user.role },
      });
    }

    res.json({
      message: 'User updated successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default updateUser;
