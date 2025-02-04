import Likes from "../../models/Likes.js";

const getTemplateLikeCount = async (req, res) => {
  try {
    const { templateId } = req.params;

    const likeCount = await Likes.count({
      where: { templateId },
    });

    res.status(200).json({
      message: "Template like count retrieved successfully",
      likeCount,
    });
  } catch (error) {
    console.error("Error fetching template like count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getTemplateLikeCount;