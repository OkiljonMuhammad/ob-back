import Template from "../../models/Template.js";
import Question from "../../models/Question.js";
import { Op } from "sequelize";
import "dotenv/config";

export const getSingleTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    const whereClause = {};
    const filters = [];

    // For unauthorized users (only public template)
    if (!req.user) {
      filters.push({ isPublic: true });
    } 
    // For admins (see all template)
    else if (req.user.role === process.env.ADMIN_ROLE) {
      // No restrictions needed for admins
    } 
    // For owners (see their own template)
    else {
      filters.push({ userId: req.user.id });
    }

    if (filters.length > 0) {
      whereClause[Op.and] = filters;
    }

    const template = await Template.findOne({
      where: { templateId, ...whereClause },
      attributes: ["id", "title", "description", "topic", "image", "isPublic", "tags", "userId"],
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const questions = await Question.findAll({
      where: { templateId: id },
      attributes: ["id", "type", "text", "isVisibleInTable", "order"],
      order: [["order", "ASC"]],
    });

    return res.status(200).json({
      template: {
        ...template.toJSON(),
        questions,
      },
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};