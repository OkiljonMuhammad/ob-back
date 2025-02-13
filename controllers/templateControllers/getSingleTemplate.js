import db from '../../models/index.js';
import 'dotenv/config';
import { Op } from 'sequelize'; // Import Op for Sequelize queries

export const getSingleTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    // Build the WHERE clause based on user role and authorization
    const whereClause = {};
    if (!req.user) {
      // Unauthorized users can only access public templates
      whereClause.isPublic = true;
    } else if (req.user.role !== process.env.ADMIN_ROLE) {
      // Non-admin users can only access their own templates
      whereClause.userId = req.user.id;
    }

    // Fetch the template with associated Topic
    const template = await db.Template.findOne({
      where: { id: templateId, ...whereClause },
      include: [
        {
          model: db.Topic, // Include the associated Topic
          attributes: ['id', 'topicName'], // Select only necessary fields from Topic
        },
      ],
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Fetch associated Tags if tagIds exist
    const associatedTags = template.tagIds
      ? await db.Tag.findAll({
          where: { id: { [Op.in]: template.tagIds } }, // Use Op.in for array of IDs
        })
      : [];

    // Fetch questions associated with the template
    const questions = await db.Question.findAll({
      where: { templateId: template.id }, // Use `template.id` to match the foreign key
      attributes: ['id', 'type', 'text', 'isVisibleInTable', 'order'],
      order: [['order', 'ASC']], // Order questions by their `order` field
    });

    // let tagIds = template.tagIds; // Assuming tagIds is already parsed by Sequelize
    // if (typeof tagIds === 'string') {
    //   try {
    //     tagIds = JSON.parse(tagIds); // Parse JSON string to array
    //   } catch (parseError) {
    //     console.error('Error parsing tagIds:', parseError);
    //     tagIds = []; // Default to empty array if parsing fails
    //   }
    // }
    // Return the template along with its associated questions and tags
    return res.status(200).json({
      template: {
        ...template.toJSON(),
        questions,
        Tags: associatedTags, // Rename Tags to tags for consistency
      },
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
