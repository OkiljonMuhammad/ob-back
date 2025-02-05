import sequelize from "../../config/database.js";
import Template from "../../models/Template.js";
import Question from "../../models/Question.js";

const addQuestions = async (req, res) => {
  const transaction = await sequelize.transaction(); 
  try {
      const { id: templateId } = req.params;

      const { questions } = req.body;

      if (!Array.isArray(questions) || questions.length === 0) {
          await transaction.rollback();
          return res.status(400).json({ message: "Questions must be a non-empty array" });
      }

      for (const question of questions) {
          if (
              !question.type ||
              !["single-line", "multi-line", "integer", "checkbox"].includes(question.type) ||
              !question.text ||
              typeof question.text !== "string"
          ) {
              await transaction.rollback();
              return res.status(400).json({ message: "Invalid question format" });
          }
      }

      const template = await Template.findByPk(templateId, { transaction });
      if (!template) {
          await transaction.rollback();
          return res.status(404).json({ message: "Template not found" });
      }

      const lastQuestion = await Question.findOne({
          where: { templateId },
          order: [["order", "DESC"]],
          attributes: ["order"],
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

      const createdQuestions = await Question.bulkCreate(questionsToCreate, { transaction });

      await transaction.commit();

      return res.status(201).json({
          message: "Questions added successfully",
          questions: createdQuestions,
      });
  } catch (error) {
      await transaction.rollback();
      console.error("Error adding questions:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
};

export default addQuestions;