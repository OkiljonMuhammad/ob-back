import db from "../../models/index.js";

// Middleware to check API token
export const authenticateApiToken = async (req, res, next) => {
  try {
    const token = req.headers["x-api-token"];
    console.log("token: ");
    console.log(typeof token);
    console.log(token);
    if (!token) return res.status(401).json({ error: "API token required" });

    const user = await db.User.findOne({ where: { apiToken: token } });
    if (!user) return res.status(403).json({ error: "Invalid API token" });

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Fetch aggregated form results
export const getAggregatedResults = async (req, res) => {
  try {
    const forms = await db.Form.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: db.Template,
          include: [{ model: db.Question }],
        },
        { model: db.Answer },
      ],
    });
    if (!forms || forms.length === 0) {
      return res.status(404).json({ message: "No forms found" });
    }
    
    const aggregatedResults = forms.map((form) => {
      const questions = form.Template?.Questions ?? [];
      const responseCount = Array.isArray(form.Answers) ? form.Answers.length : 0;
    
      return {
        templateTitle: form.Template?.title || "Unknown",
        templateAuthor: req.user?.username || "Unknown",
        templateDescription: form.Template?.description || "No description",
        questionCount: questions.length,
        responsesCount: responseCount,
        statistics: questions.length > 0 ? questions.map((question) => {
          const responses = Array.isArray(form.Answers)
            ? form.Answers.filter((a) => a.questionId === question.id).map((a) => a.response)
            : [];
          if (question.type === "integer" && responses.length > 0) {
            const numericResponses = responses.map(Number);
            return {
              question: question.text,
              min: Math.min(...numericResponses),
              max: Math.max(...numericResponses),
              avg: numericResponses.reduce((a, b) => a + b, 0) / numericResponses.length || 0,
            };
          } else {
            return {
              question: question?.text,
              mostCommonAnswers: [...new Set(responses)].slice(0, 3),
            };
          }
        }) : [],
      };
    });
    res.json({
      message: "Template results fechted successfully.", 
      result: aggregatedResults });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
