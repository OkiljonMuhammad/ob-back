import User from '../../models/User.js';
import AdminLog from '../../models/AdminLog.js';

const hardDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.unscoped().findByPk(userId, { paranoid: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.canDeleteUser(user)) {
      return res
        .status(403)
        .json({ message: 'You cannot delete your admin account.' });
    }

    await user.destroy({ force: true });

    await AdminLog.create({
      adminId: req.user.id,
      action: `Hard-deleted user ${userId}`,
      details: { userId },
    });

    res.status(200).json({
      message: 'User hard-deleted successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error hard-deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default hardDeleteUser;
