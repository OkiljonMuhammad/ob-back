import Form from '../../models/Form.js';

const getSingleForm = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findByPk(id, {
      attributes: ['id', 'templateId', 'userId', 'answers', 'dateFilled'],
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    return res.status(200).json({
      form,
    });
  } catch (error) {
    console.error('Error fetching form:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default getSingleForm;
