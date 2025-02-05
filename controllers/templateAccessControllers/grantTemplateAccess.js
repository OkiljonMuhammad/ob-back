import TemplateAccess from "../../models/TemplateAccess.js";
import Template from "../../models/Template.js";
import "dotenv/config";

const grantTemplateAccess = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const template = await Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const isAdmin = req.user.role === process.env.ADMIN_ROLE;
    const isOwner = req.user.id === template.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        message: "You are not authorized to grant template access" })
    }

    const existingAccess = await TemplateAccess.findOne({
      where: { templateId, userId },
    });

    if (existingAccess) {
      return res.status(400).json({ message: "User already has access to this template" });
    }

    const newAccess = await TemplateAccess.create({
      templateId,
      userId,
    });

    res.status(201).json({
      message: "Template access granted successfully",
      access: newAccess,
    });
  } catch (error) {
    console.error("Error granting template access:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default grantTemplateAccess;