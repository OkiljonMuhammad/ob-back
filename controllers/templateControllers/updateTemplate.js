import Template from '../../models/Template.js';
import User from '../../models/User.js';

const updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { title, description, topicId, image, isPublic, tags } = req.body;
    const template = await Template.findByPk(templateId);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user || !user.hasAccess(template.userId)) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to update this template' });
    }

    await template.update({
      title: title ?? template.title,
      description: description ?? template.description,
      topicId: topicId ?? template.topicId,
      image: image ?? template.image,
      isPublic: isPublic !== undefined ? isPublic : template.isPublic,
      tags: tags ?? template.tags,
    });

    res.status(200).json({
      message: 'Template updated successfully',
      template: template,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default updateTemplate;
