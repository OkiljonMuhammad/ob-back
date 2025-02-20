import db from '../../models/index.js';

const createForm = async (req, res) => {
  try {
    const { templateId } = req.body;

    const template = await db.Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const form = await db.Form.create({
      templateId,
      name: template.title,
      userId: req.user.id,
    });

    return res.status(201).json({
      message: 'Form created successfully',
      form,
    });
  } catch (error) {
    console.error('Error creating form:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default createForm;
