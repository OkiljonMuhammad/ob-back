import Comment from "../../models/Comment.js";

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!req.user.isAdmin() && comment.userId !== req.user.id) {
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