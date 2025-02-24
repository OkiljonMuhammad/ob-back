import db from '../../models/index.js';
import { Op } from 'sequelize';
import 'dotenv/config';

const parseNumber = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
};

const getAnswers = async (req, res) => {
  try {
    const { formId } = req.params;

    const parsedFormId = parseInt(formId, 10);
    if (isNaN(parsedFormId) || parsedFormId < 1) {
      return res.status(400).json({ message: 'Invalid form ID' });
    }

    const { page: rawPage, limit: rawLimit, search } = req.query;

    const page = parseNumber(rawPage, 1);
    const limit = parseNumber(rawLimit, 10);

    const offset = (page - 1) * limit;

    const whereClause = { formId: parsedFormId };
    const filters = [];
    
    const sanitizedSearch = search ? search.trim() : '';
    if (!isNaN(parseInt(sanitizedSearch))) {
      filters.push({ userId: parseInt(sanitizedSearch) });
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

    const formAnswers = await db.Answer.findAll({
      attributes: [
        'id',
        'formId',
        'questionId',
        'userId',
        'response',
        'createdAt',
        'updatedAt'
      ],
      include: [{
        model: db.User,
        attributes: ['username'],
      }],
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    const groupedAnswers = formAnswers.reduce((acc, answer) => {
      const { userId, questionId, response, createdAt, updatedAt, User } = answer;
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          username: User?.username || "unknown",
          answers: [],
        };
      }
      acc[userId].answers.push({ questionId, response, createdAt, updatedAt });
      return acc;
    }, {});

    const result = Object.values(groupedAnswers).slice(offset, offset + limit);

    res.status(200).json({
      message: 'All answers retrieved successfully',
      answers: result,
      pagination: {
        total:  Object.keys(groupedAnswers).length,
        page,
        totalPages: Math.ceil(Object.keys(groupedAnswers).length / limit),
        prevPage: page > 1 ? `/api/answer/answers/${formId}?page=${page - 1}&limit=${limit}` : null,
        nextPage:
          page < Math.ceil(Object.keys(groupedAnswers).length / limit)
            ? `/api/answer/answers/${formId}?page=${page + 1}&limit=${limit}`
            : null,
      },
    });
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default getAnswers;