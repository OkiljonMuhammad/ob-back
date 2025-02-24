import db from '../../models/index.js';
import 'dotenv/config';
import { Op } from 'sequelize'; 

export const getSingleTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    const whereClause = {};
    if (!req.user) {
      whereClause.isPublic = true;
    } else if (req.user.role !== process.env.ADMIN_ROLE) {
      whereClause.userId = req.user.id;
    }

    const template = await db.Template.findOne({
      where: { id: templateId, ...whereClause },
      include: [
        {
          model: db.Topic, 
          attributes: ['id', 'topicName'],
        },
      ],
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const associatedTags = template.tagIds
      ? await db.Tag.findAll({
          where: { id: { [Op.in]: template.tagIds } },
        })
      : [];

    const questions = await db.Question.findAll({
      where: { templateId: template.id }, 
      attributes: ['id', 'type', 'text', 'isVisibleInTable', 'order'],
      order: [['order', 'ASC']], 
    });
    
    return res.status(200).json({
      template: {
        ...template.toJSON(),
        questions,
        Tags: associatedTags, 
      },
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
