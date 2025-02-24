import sequelize from '../../config/database.js';
import db from '../../models/index.js';

const updateQuestions = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const templateId = parseInt(req.params.templateId, 10);

    if (isNaN(templateId)) {
      return res.status(400).json({ message: 'Invalid template ID' });
    }

    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty questions array' });
    }

    const template = await db.Template.findByPk(templateId, { transaction });

    if (!template) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Template not found' });
    }

    const existingQuestions = await db.Question.findAll({
      where: { templateId },
      attributes: ['id', 'order'],
      transaction,
    });

    const existingQuestionMap = new Map(existingQuestions.map((q) => [q.id, q]));
    const updates = [];
    const newOrderMap = new Map();

    for (const question of questions) {
      const { id, type, text, isVisibleInTable, order } = question;

      if (existingQuestionMap.has(id)) {
        const updatesForQuestion = {};
        if (type !== undefined) updatesForQuestion.type = type;
        if (text !== undefined) updatesForQuestion.text = text;
        if (isVisibleInTable !== undefined) updatesForQuestion.isVisibleInTable = isVisibleInTable;
        if (order !== undefined && Number.isInteger(order) && order > 0) {
          newOrderMap.set(id, order);
        }

        if (Object.keys(updatesForQuestion).length > 0) {
          updates.push({ id, ...updatesForQuestion });
        }
      }
    }

    if (updates.length > 0) {
      await Promise.all(
        updates.map((update) =>
          db.Question.update(update, { where: { id: update.id }, transaction })
        )
      );
    }

    const remainingQuestions = await db.Question.findAll({
      where: { templateId },
      attributes: ['id', 'order'],
      order: [['order', 'ASC']],
      transaction,
    });

    let currentOrder = 1;
    for (const question of remainingQuestions) {
      if (question.order !== currentOrder) {
        await question.update({ order: currentOrder }, { transaction });
      }
      currentOrder++;
    }

    await transaction.commit();

    return res.status(200).json({
      message: 'Questions updated successfully',
      updatedQuestions: updates.map((q) => ({ id: q.id })),
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating questions:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default updateQuestions;
