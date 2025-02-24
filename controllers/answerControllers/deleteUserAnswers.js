import db from '../../models/index.js';
import 'dotenv/config';

const deleteUserAnswers = async (req, res) => {
  try {
    const { formId, userId } = req.params;

    const parsedFormId = parseInt(formId, 10);
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedFormId) || parsedFormId < 1 || isNaN(parsedUserId) || parsedUserId < 1) {
      return res.status(400).json({ message: 'Invalid form ID or user ID' });
    }

    if (!req.user) {
      return res.status(403).json({ message: 'You are not authorized to delete answers' });
    }

     const form = await db.Form.findByPk(formId, {
          attributes: ['id', 'userId'],
        });
    
        if (!form) {
          return res.status(404).json({ message: 'Form not found' });
        }
    
        if (req.user.role !== process.env.ADMIN_ROLE && req.user.id !== parseInt(form.userId) && req.user.id !== userId) {
          return res.status(403).json({ message: 'You can only delete your own responses' });
        }
  
    const deletedCount = await db.Answer.destroy({
      where: { formId: parsedFormId, userId: parsedUserId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'No answers found for the specified user and form' });
    }

    res.status(200).json({ message: 'User answers deleted successfully' });
  } catch (error) {
    console.error('Error deleting user answers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default deleteUserAnswers;
