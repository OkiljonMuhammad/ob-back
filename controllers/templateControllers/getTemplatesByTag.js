import db from '../../models/index.js';
import { Op } from 'sequelize';
import 'dotenv/config';

const parseNumber = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
};

const getTemplatesByTag = async (req, res) => {
  try {
    const { page: rawPage, limit: rawLimit, tagId } = req.query;

    const page = parseNumber(rawPage, 1); 
    const limit = parseNumber(rawLimit, 10); 

    const offset = (page - 1) * limit;

    const whereClause = {};
    const filters = [];

    if (tagId) {
      filters.push({ [Op.in]: [{ tagIds: tagId }] });
    }
    if (!req.user) {
      filters.push({ isPublic: true });
    }
    else if (req.user.role === process.env.ADMIN_ROLE) {
    }
    else {
      filters.push({ [Op.or]: [{ userId: req.user.id }] });
    }

    if (filters.length > 0) {
      whereClause[Op.and] = filters;
    }

    const include = [
      {
        model: db.User,
        attributes: ['username'],
      },
    ];

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

export default getTemplatesByTag;