import Tag from '../../models/Tag.js';
import { Op } from 'sequelize';

const suggestTags = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Query parameter "q" is required.' });
    }

    const tags = await Tag.findAll({
      where: {
        tagName: {
          [Op.like]: `%${q}%`,
        },
      },
      limit: 10,
    });

    res.status(200).json({
      message: 'Tag suggestions retrieved successfully.',
      tags: tags.map((tag) => ({ id: tag.id, tagName: tag.tagName })),
    });
  } catch (error) {
    console.error('Error suggesting tags:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default suggestTags;