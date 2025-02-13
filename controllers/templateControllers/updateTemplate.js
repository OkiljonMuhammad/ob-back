import db from '../../models/index.js';

const updateTemplate = async (req, res) => {
  const transaction = await db.sequelize.transaction(); // Start a transaction
  try {
    const { templateId } = req.params;
    const { title, description, topicId, image, isPublic, tagIds } = req.body;

    // Validate required fields
    if (!templateId || !title || !description) {
      await transaction.rollback(); // Rollback the transaction
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the template by its ID with associated Topic and Tags
    const template = await db.Template.findByPk(templateId, {
      include: [
        {
          model: db.Topic, // Include the associated Topic (default name: Topic)
          attributes: ['id', 'topicName'], // Select only necessary fields from Topic
        },
        {
          model: db.Tag, // Include the associated Tags (default name: Tags)
          through: { attributes: [] }, // Exclude join table attributes
          attributes: ['id', 'tagName'], // Select only necessary fields from Tag
        },
      ],
      transaction,
    });

    if (!template) {
      await transaction.rollback(); // Rollback the transaction
      return res.status(404).json({ message: 'Template not found' });
    }

    // Check user authorization
    const user = await db.User.findByPk(req.user.id, { transaction });
    if (!user || !user.hasAccess(template.userId)) {
      await transaction.rollback(); // Rollback the transaction
      return res
        .status(403)
        .json({ message: 'You are not authorized to update this template' });
    }

    // Update basic template fields
    await template.update(
      {
        title: title ?? template.title,
        description: description ?? template.description,
        image: image ?? template.image,
        isPublic: isPublic !== undefined ? isPublic : template.isPublic,
      },
      { transaction }
    );

    // Handle topic update (One-to-Many relationship)
    if (topicId && topicId !== template.topicId) {
      const newTopic = await db.Topic.findByPk(topicId, { transaction });
      if (!newTopic) {
        await transaction.rollback(); // Rollback the transaction
        return res.status(404).json({ message: 'Topic not found' });
      }
      await template.setTopic(newTopic, { transaction }); // Set the new topic using the association method
    }

    // Handle tags update (Many-to-Many relationship)
    if (tagIds) {
      const tags = await db.Tag.findAll({
        where: { id: tagIds },
        transaction,
      });

      if (tags.length !== tagIds.length) {
        await transaction.rollback(); // Rollback the transaction
        return res.status(400).json({ message: 'One or more tags not found' });
      }

      // Set the new tags for the template (this will replace existing tags)
      await template.setTags(tags, { transaction }); // Replace existing tags with the new ones
    }

    // Fetch the updated template with associated topic and tags
    const updatedTemplate = await db.Template.findByPk(templateId, {
      include: [
        {
          model: db.Topic, // Include the associated Topic (default name: Topic)
          attributes: ['id', 'topicName'], // Select only necessary fields from Topic
        },
        {
          model: db.Tag, // Include the associated Tags (default name: Tags)
          through: { attributes: [] }, // Exclude join table attributes
          attributes: ['id', 'tagName'], // Select only necessary fields from Tag
        },
      ],
      transaction,
    });

    await transaction.commit(); // Commit the transaction

    // Return success response
    res.status(200).json({
      message: 'Template updated successfully',
      template: updatedTemplate,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    await transaction.rollback(); // Rollback the transaction in case of an error
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default updateTemplate;
