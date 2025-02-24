import db from '../../models/index.js';

export const createAnswers = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Answers should be a non-empty array' });
    }

    const questionIds = answers.map(a => a.questionId);
    const questions = await db.Question.findAll({ where: { id: questionIds } });
    const questionMap = new Map(questions.map(q => [q.id, q.type]));

    const validAnswers = [];
    for (const { formId, questionId, userId, response } of answers) {
      const questionType = questionMap.get(questionId);
      
      if (!questionType) {
        return res.status(404).json({ error: `Question ID ${questionId} not found` });
      }

      validAnswers.push({ formId, questionId, userId, response });
    }

    const savedAnswers = await db.Answer.bulkCreate(validAnswers);

    return res.status(201).json({ message: 'Answers saved successfully', answers: savedAnswers });
  } catch (error) {
    console.error('Error creating answers:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
