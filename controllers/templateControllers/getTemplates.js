import db from '../../models/index.js';
import { Op } from 'sequelize';
import 'dotenv/config';

// Helper function to parse and validate numbers
const parseNumber = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
};

const getAllTemplates = async (req, res) => {
  try {
    const { page: rawPage, limit: rawLimit, tagId, topic, search } = req.query;

    // Parse and validate page and limit
    const page = parseNumber(rawPage, 1); // Default to 1 if invalid
    const limit = parseNumber(rawLimit, 10); // Default to 10 if invalid

    // Calculate offset
    const offset = (page - 1) * limit;

    const whereClause = {};
    const filters = [];

    if (tagId) {
      filters.push(
        db.sequelize.where(
          db.sequelize.fn('JSON_CONTAINS', db.sequelize.col('tagIds'), db.sequelize.literal(`'${tagId}'`)),
          true
        )
      );
    }

    if (topic) {
      filters.push({ '$Topic.topicName$': topic }); // Filter by associated Topic model
    }
    const sanitizedSearch = search ? search.trim() : '';
    if (sanitizedSearch) {
      // Case-insensitive search for the title field
      filters.push({ title: { [Op.like]: `%${sanitizedSearch}%` } });
    }

    // For unauthorized users (only public templates)
    if (!req.user) {
      filters.push({ isPublic: true });
    }
    // For admins (see all templates)
    else if (req.user.role === process.env.ADMIN_ROLE) {
      // No restrictions needed for admins
    }
    // For owners (see their own templates)
    else {
      filters.push({ [Op.or]: [{ userId: req.user.id }] });
    }

    if (filters.length > 0) {
      whereClause[Op.and] = filters;
    }

    const include = [
      {
        model: db.Topic,
        attributes: ['id', 'topicName'],
      },
      {
        model: db.User,
        attributes: ['username'],
      },
    ];

    // Include User model if the user is an admin

    const templates = await db.Template.findAndCountAll({
      attributes: [
        'id',
        'title',
        'description',
        'image',
        'isPublic',
        'userId',
        'createdAt',
      ],
      where: whereClause,
      include,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'All templates retrieved successfully',
      templates: templates.rows,
      pagination: {
        total: templates.count,
        page,
        totalPages: Math.ceil(templates.count / limit),
        prevPage: page > 1 ? `/api/templates?page=${page - 1}&limit=${limit}` : null,
        nextPage:
          page < Math.ceil(templates.count / limit)
            ? `/api/templates?page=${page + 1}&limit=${limit}`
            : null,
      },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default getAllTemplates;