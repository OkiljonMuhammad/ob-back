import db from '../../models/index.js';
import 'dotenv/config';

const grantFormAccess = async (req, res) => {
  try {
    const { formId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const form = await db.Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ message: 'form not found' });
    }

    const isAdmin = req.user.role === process.env.ADMIN_ROLE;
    const isOwner = req.user.id === form.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: 'You are not authorized to grant form access',
      });
    }

    const existingAccess = await db.FormAccess.findOne({
      where: { formId, userId },
    });

    if (existingAccess) {
      return res
        .status(400)
        .json({ message: 'User already has access to this form' });
    }

    const newAccess = await db.FormAccess.create({
      formId,
      userId,
    });

    res.status(201).json({
      message: 'Form access granted successfully',
      access: newAccess,
    });
  } catch (error) {
    console.error('Error granting form access:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default grantFormAccess;
