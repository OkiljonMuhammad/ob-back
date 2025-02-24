import db from '../../models/index.js';
import { Op } from 'sequelize';
import 'dotenv/config';

const parseNumber = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
};

const getAllForms = async (req, res) => {
  try {
    const { page: rawPage, limit: rawLimit, search } = req.query;

    const page = parseNumber(rawPage, 1);
    const limit = parseNumber(rawLimit, 10);

    const offset = (page - 1) * limit;

    const whereClause = {};
    const filters = [];
    
    const sanitizedSearch = search ? search.trim() : '';
    if (sanitizedSearch) {
      filters.push({ name: { [Op.like]: `%${sanitizedSearch}%` } });
    }

    if (!req.user) {
      return res.status(403).json({message: 'You are not authorized to get forms'});
    }
    else if (req.user.role === process.env.ADMIN_ROLE) {
    }
    else {
      filters.push({ [Op.or]: [{ userId: req.user.id }] });
    }

    if (filters.length > 0) {
      whereClause[Op.and] = filters;
    }

    const forms = await db.Form.findAndCountAll({
      attributes: [
        'id',
        'name',
        'templateId',
        'userId',
        'createdAt',
      ],
      where: whereClause,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'All forms retrieved successfully',
      forms: forms.rows,
      pagination: {
        total: forms.count,
        page,
        totalPages: Math.ceil(forms.count / limit),
        prevPage: page > 1 ? `/api/form/forms?page=${page - 1}&limit=${limit}` : null,
        nextPage:
          page < Math.ceil(forms.count / limit)
            ? `/api/form/forms?page=${page + 1}&limit=${limit}`
            : null,
      },
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default getAllForms;