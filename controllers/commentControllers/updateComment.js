import Comment from "../../models/Comment.js";
import "dotenv/config";

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isAdmin = req.user.role === process.env.ADMIN_ROLE;
    const isOwner = req.user.id === comment.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "You are not authorized to update this comment" });
    }

    await comment.update({
      content: content ?? comment.content,
    });

    res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default updateComment;