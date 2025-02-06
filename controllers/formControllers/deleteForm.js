import Form from '../../models/Form.js';

const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findByPk(id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
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
