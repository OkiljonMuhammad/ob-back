import Form from '../../models/Form.js';

const getForms = async (req, res) => {
  try {
    const { templateId } = req.params;

    const forms = await Form.findAll({
      where: { templateId },
      attributes: ['id', 'userId', 'answers', 'dateFilled'],
    });

    return res.status(200).json({
      forms,
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default getForms;
