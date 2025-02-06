import Template from '../../models/Template.js';
import { Op } from 'sequelize';
import 'dotenv/config';

const getAllTemplates = async (req, res) => {
  try {
    const { page = 1, limit = 10, topic, search } = req.query;
    const parsedLimit = parseInt(limit);
    const whereClause = {};

    if (topic) {
      whereClause.topic = topic;
    }

    const filters = [];

    if (search) {
      filters.push({ title: { [Op.like]: `%${search}%` } });
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

    const templates = await Template.findAndCountAll({
      attributes: [
        'id',
        'title',
        'description',
        'topic',
        'image',
        'isPublic',
        'tags',
        'userId',
      ],
      where: whereClause,
      offset: (page - 1) * parsedLimit,
      limit: parsedLimit,
    });

    res.status(200).json({
      message: 'All templates retrieved successfully',
      templates: templates.rows,
      pagination: {
        total: templates.count,
        page: parseInt(page),
        totalPages: Math.ceil(templates.count / parsedLimit),
        prevPage:
          page > 1
            ? `/api/templates?page=${parseInt(page) - 1}&limit=${parsedLimit}`
            : null,
        nextPage:
          page < Math.ceil(templates.count / parsedLimit)
            ? `/api/templates?page=${parseInt(page) + 1}&limit=${parsedLimit}`
            : null,
      },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getAllTemplates;
