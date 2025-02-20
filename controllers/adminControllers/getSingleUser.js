import db from '../../models/index.js';

const getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.User.findOne({
      attributes: ['id', 'username', 'email', 'role', 'isBlocked', 'createdAt', 'updatedAt'],
      where: {'id': userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User retrieved successfully.',
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default getSingleUser;