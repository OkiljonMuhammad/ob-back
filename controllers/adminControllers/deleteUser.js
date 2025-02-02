import User from "../../models/User.js"
import AdminLog from "../../models/AdminLog.js"

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.unscoped().findByPk(userId);
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        await user.destroy();

        await AdminLog.create({
        adminId: req.user.id,
        action: `Soft-deleted user ${userId}`,
        details: { userId },
        });

        res.status(200).json({
        message: "User soft-deleted successfully",
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default deleteUser;