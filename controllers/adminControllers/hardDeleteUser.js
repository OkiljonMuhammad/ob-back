import db from '../../models/index.js';
import AdminLog from '../../models/AdminLog.js';
import "dotenv/config"
const ADMIN_ROLE = process.env.ADMIN_ROLE;
const hardDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await db.User.unscoped().findByPk(userId, { paranoid: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isAdmin = req.user.role === ADMIN_ROLE;
    const isEqual = req.user.id === parseInt(userId)

    if (isAdmin && isEqual) {
      return res
        .status(403)
        .json({ message: 'You cannot delete your admin account.' });
    }

    await user.destroy({ force: true });

    await AdminLog.create({
      adminId: req.user.id,
      action: `Hard deleted user ${userId}`,
      details: { userId },
    });

    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default hardDeleteUser;
