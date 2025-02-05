import Likes from "../../models/Likes.js";
import Template from "../../models/Template.js";
import "dotenv/config";

const getTemplateLikes = async (req, res) => {
  try {
    const { templateId } = req.params;

    const { page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (page - 1) * parsedLimit;
    const template = await Template.findByPk(templateId);
    
    const isAdmin = req.user.role === process.env.ADMIN_ROLE;
    const isOwner = req.user.id === template.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        message: "You are not authorized to get template likes" })
    }
    const { rows, count } = await Likes.findAndCountAll({
      where: { templateId },
      attributes: ["id", "userId", "createdAt"],
      limit: parsedLimit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Template likes retrieved successfully",
      likes: rows,
      pagination: {
        total: count,
        page: parsedPage,
        totalPages: Math.ceil(count / parsedLimit),
        prevPage: 
        page > 1 ? `/api/template/${templateId}/likes?page=${parsedPage - 1}&limit=${parsedLimit}` : null,
        nextPage:
          page < Math.ceil(count / parsedLimit)
            ? `/api/template/${templateId}/likes?page=${parsedPage + 1}&limit=${parsedLimit}`
            : null,
      },
    });
  } catch (error) {
    console.error("Error fetching template likes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getTemplateLikes;