import Form from '../../models/Form.js';
import Template from '../../models/Template.js';

const submitForm = async (req, res) => {
  try {
    const { templateId, answers } = req.body;

    if (!templateId || !answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const template = await Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const form = await Form.create({
      templateId,
      userId: req.user.id,
      answers,
    });

    return res.status(201).json({
      message: 'Form submitted successfully',
      form,
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default submitForm;
