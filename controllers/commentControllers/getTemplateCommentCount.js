import Comment from "../../models/Comment.js";

const getTemplateCommentCount = async (req, res) => {
  try {
    const { templateId } = req.params;

    const commentCount = await Comment.count({
      where: { templateId },
    });

    res.status(200).json({
      message: "Template comment count retrieved successfully",
      commentCount,
    });
  } catch (error) {
    console.error("Error fetching template comment count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getTemplateCommentCount;