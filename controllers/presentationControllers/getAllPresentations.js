import { Presentation } from "../../models/presentationModels/index.js";
import { Op } from 'sequelize';
import 'dotenv/config';

const parseNumber = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
};

const getAllPresentations = async (req, res) => {
  try {
    const { page: rawPage, limit: rawLimit, search } = req.query;

    const page = parseNumber(rawPage, 1);
    const limit = parseNumber(rawLimit, 10);

    const offset = (page - 1) * limit;

    const whereClause = {};
    const filters = [];
    
    const sanitizedSearch = search ? search.trim() : '';
    if (sanitizedSearch) {
      filters.push({ title: { [Op.like]: `%${sanitizedSearch}%` } });
    }

    if (!req.user) {
    }
    else if (req.user.role === process.env.ADMIN_ROLE) {
    }
    else {
      filters.push({ [Op.or]: [{ creatorId: req.user.id }] });
    }

    if (filters.length > 0) {
      whereClause[Op.and] = filters;
    }

    const presentations = await Presentation.findAndCountAll({
      attributes: [
        'id',
        'title',
        'creatorId',
        'createdAt',
      ],
      where: whereClause,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'All presentations retrieved successfully',
      presentations: presentations.rows,
      pagination: {
        total: presentations.count,
        page,
        totalPages: Math.ceil(presentations.count / limit),
        prevPage: page > 1 ? `/api/presentation/presentations?page=${page - 1}&limit=${limit}` : null,
        nextPage:
          page < Math.ceil(presentations.count / limit)
            ? `/api/presentation/presentations?page=${page + 1}&limit=${limit}`
            : null,
      },
    });
  } catch (error) {
    console.error('Error fetching presentations:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default getAllPresentations;