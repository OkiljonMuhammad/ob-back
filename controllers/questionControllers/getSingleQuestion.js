import Question from "../../models/Question.js";

const getSingleQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findByPk(id, {
            attributes: ["id", "templateId", "type", "text", "isVisibleInTable", "order"],
        });

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        return res.status(200).json({
            question,
        });
    } catch (error) {
        console.error("Error fetching question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default getSingleQuestion;