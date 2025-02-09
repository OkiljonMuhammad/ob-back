import Template from '../../models/Template.js';
import Tag from '../../models/Tag.js';

const createTemplate = async (req, res) => {
  try {
    const { title, description, topicId, image, isPublic, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }
    const parsedTopicId = parseInt(topicId, 10);
    if (!parsedTopicId) {
      return res.status(400).json({ message: 'Invalid Topic ID.' });
    }

    let tagIds = [];
    if (tags && Array.isArray(tags)) {
      const tagRecords = await Promise.all(
        tags.map(async (tagName) => {
          const [tag] = await Tag.findOrCreate({
            where: { tagName },
            defaults: { tagName },
          });
          return tag;
        })
      );
      tagIds = tagRecords.map((tag) => tag.id);
    }

    const newTemplate = await Template.create({
      title,
      description,
      topicId: parsedTopicId,
      image,
      isPublic: isPublic !== undefined ? isPublic : true,
      userId: req.user.id,
      tagIds,
    });

    const associatedTags = await Tag.findAll({
      where: { id: tagIds },
    });

    res.status(201).json({
      message: 'Template created successfully.',
      template: {
        ...newTemplate.toJSON(),
        Tags: associatedTags,
      },
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default createTemplate;