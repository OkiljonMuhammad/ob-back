import User from "../../models/User.js";
import AdminLog from "../../models/AdminLog.js";

const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    await AdminLog.create({
      adminId: req.user.id,
      action: `Toggled block status for user ${userId}`,
      details: { userId, newStatus: user.isBlocked },
    });

    res.status(200).json({
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("Error toggling user block status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default toggleUserBlock;
