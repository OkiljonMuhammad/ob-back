import sequelize from "../../config/database.js";
import Question from "../../models/Question.js";

const deleteQuestion = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        const question = await Question.findByPk(id, { transaction });
        if (!question) {
            await transaction.rollback();
            return res.status(404).json({ message: "Question not found" });
        }

        await question.destroy({ transaction });

        await transaction.commit();

        return res.status(200).json({
            message: "Question deleted successfully",
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default deleteQuestion;