import db from '../../models/index.js';

const updateTemplate = async (req, res) => {
  const transaction = await db.sequelize.transaction(); 
  try {
    const { templateId } = req.params;
    const { title, description, topicId, image, isPublic, tagIds } = req.body;

    if (!templateId || !title) {
      await transaction.rollback(); 
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const template = await db.Template.findByPk(templateId, {
      include: [
        {
          model: db.Topic, 
          attributes: ['id', 'topicName'], 
        },
        {
          model: db.Tag, 
          through: { attributes: [] }, 
          attributes: ['id', 'tagName'],
        },
      ],
      transaction,
    });

    if (!template) {
      await transaction.rollback(); 
      return res.status(404).json({ message: 'Template not found' });
    }

    const user = await db.User.findByPk(req.user.id, { transaction });
    if (!user || !user.hasAccess(template.userId)) {
      await transaction.rollback(); 
      return res
        .status(403)
        .json({ message: 'You are not authorized to update this template' });
    }

    await template.update(
      {
        title: title ?? template.title,
        description: description ?? template.description,
        image: image ?? template.image,
        isPublic: isPublic !== undefined ? isPublic : template.isPublic,
      },
      { transaction }
    );

    if (topicId && topicId !== template.topicId) {
      const newTopic = await db.Topic.findByPk(topicId, { transaction });
      if (!newTopic) {
        await transaction.rollback(); 
        return res.status(404).json({ message: 'Topic not found' });
      }
      await template.setTopic(newTopic, { transaction }); 
    }

    if (tagIds) {
      const tags = await db.Tag.findAll({
        where: { id: tagIds },
        transaction,
      });

      if (tags.length !== tagIds.length) {
        await transaction.rollback(); 
        return res.status(400).json({ message: 'One or more tags not found' });
      }

      await template.setTags(tags, { transaction });
    }

    const updatedTemplate = await db.Template.findByPk(templateId, {
      include: [
        {
          model: db.Topic, 
          attributes: ['id', 'topicName'],
        },
        {
          model: db.Tag, 
          through: { attributes: [] }, 
          attributes: ['id', 'tagName'], 
        },
      ],
      transaction,
    });

    await transaction.commit(); 

    res.status(200).json({
      message: 'Template updated successfully',
      template: updatedTemplate,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    await transaction.rollback(); 
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default updateTemplate;
