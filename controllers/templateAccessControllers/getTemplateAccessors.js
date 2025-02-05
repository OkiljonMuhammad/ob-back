import TemplateAccess from "../../models/TemplateAccess.js";
import User from "../../models/User.js";
import "dotenv/config";

const getUsersWithTemplateAccess = async (req, res) => {
  try {
    const { templateId } = req.params;

    const templateExists = await TemplateAccess.findOne({ where: { templateId } });
    if (!templateExists) {
      return res.status(404).json({ message: "Template not found or no users have access" });
    }

    const isAdmin = req.user.role === process.env.ADMIN_ROLE;
    const isOwner = req.user.id === templateExists.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        message: "You are not authorized to get template accessors" })
    }

    const usersWithAccess = await TemplateAccess.findAll({
      where: { templateId },
      attributes: ["userId"],
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });

    const users = usersWithAccess.map((access) => access.User);

    res.status(200).json({
      message: "Users with template access retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users with template access:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getUsersWithTemplateAccess;