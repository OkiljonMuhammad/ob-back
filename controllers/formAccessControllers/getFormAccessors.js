import db from '../../models/index.js';
import 'dotenv/config';

const getUsersWithFormAccess = async (req, res) => {
  try {
    const { formId } = req.params;

    const formExists = await db.FormAccess.findOne({
      where: { formId },
    });
    if (!formExists) {
      return res
        .status(404)
        .json({ message: 'Form not found or no users have access' });
    }

    const isAdmin = req.user.role === process.env.ADMIN_ROLE;
    const isOwner = req.user.id === formExists.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: 'You are not authorized to get form accessors',
      });
    }

    const usersWithAccess = await db.FormAccess.findAll({
      where: { formId },
      attributes: ['userId'],
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    const users = usersWithAccess.map((access) => access.User);

    res.status(200).json({
      message: 'Users with form access retrieved successfully',
      users,
    });
  } catch (error) {
    console.error('Error fetching users with form access:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getUsersWithFormAccess;
