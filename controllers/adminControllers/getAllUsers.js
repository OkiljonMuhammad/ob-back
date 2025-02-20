import User from '../../models/User.js';
import { Op } from 'sequelize';

// Helper function to parse and validate numbers
const parseNumber = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
};

const getAllUsers = async (req, res) => {
  try {
    const { page: rawPage, limit: rawLimit, role, search } = req.query;
    
    // Parse and validate page and limit
    const page = parseNumber(rawPage, 1);
    const limit = parseNumber(rawLimit, 10);
    const offset = (page - 1) * limit;

    const whereClause = {};

    const sanitizedSearch = search ? search.trim() : '';
    if (sanitizedSearch) {
      whereClause[Op.or] = [
        { id: { [Op.like]: `%${sanitizedSearch}%` } },
        { username: { [Op.like]: `%${sanitizedSearch}%` } },
        { email: { [Op.like]: `%${sanitizedSearch}%` } },
      ];
    }

    if (role) {
      whereClause.role = { [Op.like]: role };
    }

    const users = await User.unscoped().findAndCountAll({
      attributes: ['id', 'username', 'email', 'role', 'isBlocked', 'createdAt', 'updatedAt'],
      where: whereClause,
      offset,
      limit,
      order: [['id', 'ASC']],
    });

    res.status(200).json({
      message: 'All users retrieved successfully',
      users: users.rows,
      pagination: {
        total: users.count,
        page,
        totalPages: Math.ceil(users.count / limit),
        prevPage: page > 1 ? `/api/admin/users/?page=${page - 1}&limit=${limit}` : null,
        nextPage:
          page < Math.ceil(users.count / limit)
            ? `/api/admin/users/?page=${page + 1}&limit=${limit}`
            : null,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default getAllUsers;
