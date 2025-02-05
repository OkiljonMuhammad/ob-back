import express from "express";
import addQuestions from "../controllers/questionControllers/addQuestion";
import getSingleQuestion from "../controllers/questionControllers/getSingleQuestion";
import updateQuestion from "../controllers/questionControllers/updateQuestion";
import updateQuestionOrder from "../controllers/questionControllers/updateQuestionOrder";
import deleteQuestion from "../controllers/questionControllers/deleteQuestion";

const router = express.Router();

// GET /api/question/:questionId - Get a single question
router.get("/:questionId", authenticateToken, getSingleQuestion);

// POST /api/question/add - Create question/questions
router.post("/add", authenticateToken, addQuestions);

// PUT /api/question/:questionId - update a question
router.put("/:questionId", authenticateToken, updateQuestion);

// PUT /api/question/order - update question order
router.put("/order", authenticateToken, updateQuestionOrder);

// DELETE /api/question/:questionId - Delete a question
router.delete("/:questionId", authenticateToken, deleteQuestion);

export default router;