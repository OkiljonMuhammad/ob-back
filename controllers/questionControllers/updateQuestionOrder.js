import sequelize from "../../config/database.js";
import Question from "../../models/Question.js";

const updateQuestionOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { templateId, questionOrder } = req.body;

        if (!Array.isArray(questionOrder) || questionOrder.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ message: "Invalid question order format" });
        }

        const questions = await Question.findAll({
            where: { templateId },
            attributes: ["id", "order"],
            transaction,
        });

        const questionMap = new Map(questions.map((q) => [q.id, q]));

        for (const id of questionOrder) {
            if (!questionMap.has(id)) {
                await transaction.rollback();
                return res.status(400).json({ message: `Question with ID ${id} not found` });
            }
        }

        for (let i = 0; i < questionOrder.length; i++) {
            const questionId = questionOrder[i];
            const question = questionMap.get(questionId);
            await question.update({ order: i + 1 }, { transaction });
        }

        await transaction.commit();

        return res.status(200).json({
            message: "Question order updated successfully",
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating question order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default updateQuestionOrder;