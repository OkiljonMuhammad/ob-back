import db from '../../models/index.js';

const getQuestions = async (req, res) => {
  try {
    const { templateId } = req.params;

    const questions = await db.Question.findAll({
      where: { templateId },
      attributes: [
        'id',
        'templateId',
        'type',
        'text',
        'isVisibleInTable',
        'order',
      ],
    });

    return res.status(200).json({
      message: 'All questions retrieved successfully',
      questions: questions,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default getQuestions;
