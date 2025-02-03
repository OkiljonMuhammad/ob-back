import Template from "../../models/Template.js";
import { Op } from "sequelize";

const getAllTemplates = async (req, res) => {
  try {
    const { page = 1, limit = 10, topic, search } = req.query;
    const parsedLimit = parseInt(limit);

    const whereClause = {};
    if (topic) {
      whereClause.topic = topic;
    }
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { topic: { [Op.like]: `%${search}%` } },
      ];
    }

    if (req.user.role !== "admin") {
      whereClause[Op.or] = [
        { isPublic: true }, 
        { userId: req.user.id }
      ];
    }

    const templates = await Template.findAndCountAll({
      attributes: ["id", "title", "description", "topic", "image", "isPublic", "tags", "userId"],
      where: whereClause,
      offset: (page - 1) * parsedLimit,
      limit: parsedLimit,
    });

    res.status(200).json({
      message: "All templates retrieved successfully",
      templates: templates.rows,
      pagination: {
        total: templates.count,
        page: parseInt(page),
        totalPages: Math.ceil(templates.count / parsedLimit),
        prevPage: page > 1 ? `/api/templates?page=${parseInt(page) - 1}&limit=${parsedLimit}` : null,
        nextPage: page < Math.ceil(templates.count / parsedLimit) ? `/api/templates?page=${parseInt(page) + 1}&limit=${parsedLimit}` : null,
      },
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getAllTemplates;
