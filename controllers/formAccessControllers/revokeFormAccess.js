import db from '../../models/index.js';
import 'dotenv/config';

const revokeFormAccess = async (req, res) => {
  try {
    const { formId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const form = await db.form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ message: 'form not found' });
    }

    const isAdmin = req.user.role === process.env.ADMIN_ROLE;
    const isOwner = req.user.id === form.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: 'You are not authorized to revoke form access',
      });
    }

    const accessRecord = await db.formAccess.findOne({
      where: { formId, userId },
    });

    if (!accessRecord) {
      return res
        .status(404)
        .json({ message: 'User does not have access to this form' });
    }

    await accessRecord.destroy();

    res.status(200).json({
      message: 'Form access revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking form access:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default revokeFormAccess;
