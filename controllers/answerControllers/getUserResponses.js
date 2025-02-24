import db from '../../models/index.js';
import 'dotenv/config';

const getUserResponses = async (req, res) => {
  try {
    const { formId, userId } = req.params;

    if (!formId || !userId) {
      return res.status(400).json({ error: 'formId and userId are required' });
    }

    if (!req.user) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const form = await db.Form.findByPk(formId, {
      attributes: ['id', 'userId'],
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (req.user.role !== process.env.ADMIN_ROLE && req.user.id !== parseInt(form.userId) && req.user.id !== userId) {
      return res.status(403).json({ message: 'You can only access your own responses' });
    }

    const userAnswers = await db.Answer.findAll({
      where: { formId, userId },
      attributes: ['questionId', 'response', 'createdAt'],
      include: [
        {
          model: db.Question,
          attributes: ['text'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!userAnswers.length) {
      return res.status(404).json({ message: 'No responses found for this user in the specified form' });
    }

    const formattedResponses = [{
      userId,
      answers: userAnswers.reduce((acc, answer) => {
        const { response, createdAt, Question } = answer;
        const questionText = Question?.text || 'Unknown Question';

        if (!acc[questionText]) {
          acc[questionText] = [];
        }
        acc[questionText].push({ response, createdAt });
        return acc;
      }, {})
    }];
    
    return res.status(200).json({
      message: 'User responses retrieved successfully',
      formId,
      userId,
      responses: formattedResponses,
    });

  } catch (error) {
    console.error('Error fetching user responses:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default getUserResponses;
