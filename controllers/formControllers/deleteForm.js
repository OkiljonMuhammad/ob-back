import db from '../../models/index.js';

const deleteForm = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await db.Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const user = await db.User.findByPk(req.user.id);

    if (!user || !user.hasAccess(form.userId)) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this template' });
    }

    await form.destroy();

    return res.status(200).json({
      message: 'Form deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting form:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default deleteForm;
