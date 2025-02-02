import User from "../../models/User.js";
import { Op } from "sequelize";

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, includeDeleted } = req.query;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const users = await User.findAndCountAll({
      attributes: ["id", "username", "email", "role", "isBlocked"],
      where: whereClause,
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      paranoid: includeDeleted !== "true",
    });

    res.status(200).json({
      message: "All users retrieved successfully",
      users: users.rows,
      pagination: {
        total: users.count,
        page: parseInt(page),
        totalPages: Math.ceil(users.count / limit),
        prevPage: page > 1 ? `/api/admin/users?page=${parseInt(page) - 1}&limit=${limit}` : null,
        nextPage: page < Math.ceil(users.count / limit) ? `/api/admin/users?page=${parseInt(page) + 1}&limit=${limit}` : null,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getAllUsers;
