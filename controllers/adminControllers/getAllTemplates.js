import Template from "../../models/Template.js";

const getAllTemplates = async (req, res) => {
  try {
    const { page = 1, limit = 10, topic, isPublic } = req.query;

    const whereClause = {};
    if (topic) whereClause.topic = topic;
    if (isPublic !== undefined) whereClause.isPublic = isPublic === "true";

    const templates = await Template.findAndCountAll({
      attributes: ["id", "title", "description", "topic", "isPublic", "userId"],
      where: whereClause,
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });

    res.status(200).json({
      message: "All templates retrieved successfully",
      templates: templates.rows,
      pagination: {
        total: templates.count,
        page: parseInt(page),
        totalPages: Math.ceil(templates.count / limit),
        prevPage: page > 1 ? `/api/admin/templates?page=${parseInt(page) - 1}&limit=${limit}` : null,
        nextPage: page < Math.ceil(templates.count / limit) ? `/api/admin/templates?page=${parseInt(page) + 1}&limit=${limit}` : null,
      },
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getAllTemplates;