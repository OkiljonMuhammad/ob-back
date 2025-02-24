import sequelize from '../../config/database.js';
import Template from '../../models/Template.js';
import Question from '../../models/Question.js';

const addQuestions = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const templateId = parseInt(req.params.templateId, 10);
    if (isNaN(templateId)) {
      return res.status(400).json({ message: 'Invalid template ID' });
    }
    const { questions } = req.body;

    const validateQuestions = (questions) => {
      if (!Array.isArray(questions) || questions.length === 0) {
        return 'Questions must be a non-empty array';
      }
      for (const question of questions) {
        if (
          !question.type ||
          !['single-line', 'multi-line', 'integer', 'checkbox'].includes(
            question.type
          ) ||
          !question.text ||
          typeof question.text !== 'string'
        ) {
          return 'Invalid question format';
        }
      }
      return null;
    };

    const validationError = validateQuestions(questions);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const template = await Template.findByPk(templateId, { transaction });
    if (!template) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Template not found' });
    }

    const lastQuestion = await Question.findOne({
      where: { templateId },
      order: [['order', 'DESC']],
      attributes: ['order'],
      transaction,
    });
    let currentOrder = lastQuestion ? lastQuestion.order + 1 : 1;

    const questionsToCreate = questions.map((question) => ({
      templateId,
      type: question.type,
      text: question.text,
      isVisibleInTable: question.isVisibleInTable ?? true,
      order: currentOrder++,
    }));

    const createdQuestions = await Question.bulkCreate(questionsToCreate, {
      transaction,
    });

    await transaction.commit();

    return res.status(201).json({
      message: 'Questions added successfully',
      questionIds: createdQuestions.map((q) => q.id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error adding questions:', error);
    return res.status(500).json({
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : error.message,
    });
  }
};

export default addQuestions;
