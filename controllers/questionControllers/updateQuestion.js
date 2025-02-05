import { Op } from "sequelize";
import Question from "../../models/Question.js";

const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const { type, text, isVisibleInTable, order } = req.body;

        if (
            (type && !["single-line", "multi-line", "integer", "checkbox"].includes(type)) ||
            (text && typeof text !== "string") ||
            (isVisibleInTable !== undefined && typeof isVisibleInTable !== "boolean") ||
            (order && typeof order !== "number")
        ) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const updatedQuestion = await question.update({
            type: type || question.type,
            text: text || question.text,
            isVisibleInTable: isVisibleInTable !== undefined ? isVisibleInTable : question.isVisibleInTable,
            order: order || question.order,
        });

        return res.status(200).json({
            message: "Question updated successfully",
            question: updatedQuestion,
        });
    } catch (error) {
        console.error("Error updating question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default updateQuestion;