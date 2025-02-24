import db from '../../models/index.js';

const updateTemplate = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { templateId } = req.params;
    const { title, description, topicId, image, isPublic, tags } = req.body;

    if (!templateId || !title) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const template = await db.Template.findByPk(templateId, {
      include: [{ model: db.Topic, attributes: ['id', 'topicName'] }],
      transaction,
    });

    if (!template) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Template not found' });
    }

    const user = await db.User.findByPk(req.user.id);
    if (!user || !user.hasAccess(template.userId)) {
      await transaction.rollback();
      return res.status(403).json({ message: 'You are not authorized to update this template' });
    }

    let tagIds = [];
    if (tags && Array.isArray(tags)) {
      const existingTags = await db.Tag.findAll({
        where: { tagName: tags.map((tag) => tag.tagName) },
        attributes: ['id', 'tagName'],
        transaction,
      });

      const existingTagMap = new Map(existingTags.map((tag) => [tag.tagName, tag.id]));
      
      const newTags = tags.filter((tag) => !existingTagMap.has(tag.tagName));

      if (newTags.length > 0) {
        const createdTags = await db.Tag.bulkCreate(
          newTags.map((tag) => ({ tagName: tag.tagName })),
          { returning: true, transaction }
        );

        createdTags.forEach((tag) => {
          existingTagMap.set(tag.tagName, tag.id);
        });
      }

      tagIds = tags.map((tag) => existingTagMap.get(tag.tagName));
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (image !== undefined) updateFields.image = image;
    if (isPublic !== undefined) updateFields.isPublic = isPublic;
    if (tagIds.length > 0) updateFields.tagIds = tagIds;
    
    await template.update(updateFields, { transaction });

    if (topicId && topicId !== template.topicId) {
      const newTopic = await db.Topic.findByPk(topicId, { transaction });
      if (!newTopic) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Topic not found' });
      }
      await template.setTopic(newTopic, { transaction });
    }

    await transaction.commit();

    const updatedTemplate = await db.Template.findByPk(templateId, {
      include: [{ model: db.Topic, attributes: ['id', 'topicName'] }],
    });

    return res.status(200).json({
      message: 'Template updated successfully',
      template: updatedTemplate,
    });

  } catch (error) {
    console.error('Error updating template:', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default updateTemplate;
