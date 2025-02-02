import User from "../../models/User.js";
import AdminLog from "../../models/AdminLog.js";

const toggleUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.unscoped().findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = user.role === "user" ? "admin" : "user";
    await user.save();

    await AdminLog.create({
      adminId: req.user.id,
      action: `Toggled role for user ${userId}`,
      details: { userId, newRole: user.role },
    });

    res.status(200).json({
      message: user.role === "admin" ? "User promoted to admin successfully" : "User demoted to user successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("Error toggling user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default toggleUserRole;