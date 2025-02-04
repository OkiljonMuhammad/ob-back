import Likes from "../../models/Likes.js";

const likeTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    const existingLike = await Likes.findOne({
      where: {
        templateId,
        userId: req.user.id,
      },
    });

    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this template" });
    }

    const newLike = await Likes.create({
      templateId,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Template liked successfully",
      like: newLike,
    });
  } catch (error) {
    console.error("Error liking template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default likeTemplate;