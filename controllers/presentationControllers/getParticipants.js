import { User, Participant } from "../../models/presentationModels/index.js";
import { Op } from "sequelize";
import "dotenv/config";

const parseNumber = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
};

const getParticipants = async (req, res) => {
  try {
    const { presentationId } = req.params;
    const { page: rawPage, limit: rawLimit, role, search } = req.query;

    const page = parseNumber(rawPage, 1);
    const limit = parseNumber(rawLimit, 10);
    const offset = (page - 1) * limit;

    if (!req.user) {
      return res.status(403).json({ message: "You are not authorized to get participants" });
    }

    const participantWhere = { presentationId };
    if (role) {
      participantWhere.role = role;
    }

    const userWhere = {};
    if (search) {
      userWhere.username = { [Op.like]: `%${search.trim()}%` };
    }

    const participants = await Participant.findAndCountAll({
      attributes: ["id", "role", "createdAt"],
      where: participantWhere,
      include: [
        {
          model: User,
          attributes: ["id", "username"],
          where: Object.keys(userWhere).length ? userWhere : undefined,
        },
      ],
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "All participants retrieved successfully",
      participants: participants.rows.map((p) => ({
        id: p.User?.id || null,
        username: p.User?.username || "Unknown",
        role: p.role,
        createdAt: p.createdAt,
      })),
      pagination: {
        total: participants.count,
        page,
        totalPages: Math.ceil(participants.count / limit),
        prevPage: page > 1 ? `/api/participant/${presentationId}?page=${page - 1}&limit=${limit}` : null,
        nextPage:
          page < Math.ceil(participants.count / limit)
            ? `/api/participant/${presentationId}?page=${page + 1}&limit=${limit}`
            : null,
      },
    });
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getParticipants;
