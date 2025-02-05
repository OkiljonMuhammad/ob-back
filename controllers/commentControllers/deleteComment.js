import Comment from "../../models/Comment.js";
import "dotenv/config";

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isAdmin = req.user.role === process.env.ADMIN_ROLE;
    const isOwner = req.user.id === comment.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    await comment.destroy();

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteComment;