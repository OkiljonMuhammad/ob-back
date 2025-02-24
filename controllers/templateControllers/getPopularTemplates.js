import db from '../../models/index.js';
import { Op, Sequelize } from 'sequelize';
import 'dotenv/config';

const getPopularTemplates = async (req, res) => {
  try {
    const limit = 5;
    const whereClause = {};
    const filters = [];

    if (!req.user) {
      filters.push({ isPublic: true });
    } else if (req.user.role !== process.env.ADMIN_ROLE) {
      filters.push({ userId: req.user.id });
    }

    if (filters.length > 0) {
      whereClause[Op.and] = filters;
    }

    const result = await db.Form.findAll({
      attributes: [
        'templateId',
        [Sequelize.fn('COUNT', Sequelize.col('templateId')), 'usageCount']
      ],
      group: ['templateId'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('templateId')), 'DESC']],
      limit: limit
    });

    if (result.length === 0) {
      console.log('No data found.');
      return res.json([]);
    }

    const templateIds = result.map(row => row.templateId);
    console.log(`Most used templateIds: ${templateIds}`);

    whereClause.id = {
      [Op.in]: templateIds
    };

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

    const templates = await db.Template.findAll({
      attributes: ['id', 'title', 'description', 'image', 'isPublic', 'userId', 'createdAt'],
      where: whereClause,
      include,
    });

    return res.json({
      message: 'Top popular templates retrieved successfully',
      templates: templates,
    });
  } catch (error) {
    console.error('Error fetching popular templates:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default getPopularTemplates;