import TemplateAccess from "../../models/TemplateAccess.js";
import Template from "../../models/Template.js";
import "dotenv/config";

const revokeTemplateAccess = async (req, res) => {
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
        message: "You are not authorized to revoke template access" })
    }

    const accessRecord = await TemplateAccess.findOne({
      where: { templateId, userId },
    });

    if (!accessRecord) {
      return res.status(404).json({ message: "User does not have access to this template" });
    }

    await accessRecord.destroy();

    res.status(200).json({
      message: "Template access revoked successfully",
    });
  } catch (error) {
    console.error("Error revoking template access:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default revokeTemplateAccess;