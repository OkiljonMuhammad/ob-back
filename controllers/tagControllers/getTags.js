import Tag from '../../models/Tag.js';

const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      limit: 10,
    });

    res.status(200).json({
      message: 'Tags retrieved successfully.',
      tags: tags.map((tag) => ({ id: tag.id, tagName: tag.tagName })),
    });

  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default getTags;
