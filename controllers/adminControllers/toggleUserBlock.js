import db from '../../models/index.js';
import AdminLog from '../../models/AdminLog.js';

const toggleUserBlock = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { userId } = req.params;
    const user = await db.User.unscoped().findByPk(userId, { transaction });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    const isEqueal = req.user.id === parseInt(userId);
    if (isEqueal) {
      const status = user.isBlocked ? "unblock" : "block";
      await transaction.rollback();
      return res.status(403).json({ message: `You cannot ${status} your account` });
    }

    user.isBlocked = !user.isBlocked;
    await user.save({ transaction });

    await AdminLog.create(
      {
        adminId: req.user?.id || null,
        action: `Toggled block status for user ${userId}`,
        details: { userId, newStatus: user.isBlocked },
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(200).json({
      message: user.isBlocked
        ? 'User blocked successfully'
        : 'User unblocked successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error('Error toggling user block status:', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default toggleUserBlock;
