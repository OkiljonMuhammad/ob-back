import db from '../../models/index.js';

const templateResults = async (req, res) => {

  try {
    const { templateId } = req.params;

    const template = await db.Template.findByPk(templateId, {
      include: [{ model: db.Question }],
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    const questions = template.Questions;
    const aggregationResults = {};

    if (questions.length == 0) {
      return res.status(200).json({message: "No questions found"});
    }

    for (const question of questions) {
      const answers = await db.Answer.findAll({
        where: { questionId: question.id },
        attributes: ['response'],
      });
      if (answers.length == 0) {
        return res.status(200).json({message: "No answers found"});
      }
      const responses = answers?.map((a) => a.response);

      if (question.type === 'integer') {
        const sum = responses.reduce((acc, val) => acc + parseFloat(val), 0);
        const average = responses.length ? sum / responses.length : 0;
        aggregationResults[question.text] = { average };
      } else if (question.type === 'single-line' || question.type === 'multi-line') {
        const frequency = responses.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {});

        const mostFrequentAnswer = Object.keys(frequency).reduce((a, b) =>
          frequency[a] > frequency[b] ? a : b
        );

        aggregationResults[question.text] = { mostFrequentAnswer };
      }
    }

    return res.json({ templateId, aggregationResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default templateResults;
