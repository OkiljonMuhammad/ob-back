import db from '../../models/index.js';

const getTemplateComments = async (req, res) => {
  try {
    const { templateId } = req.params;

    const { page = 1, limit = 10 } = req.query;
    const parsedLimit = parseInt(limit);
    const offset = (page - 1) * parsedLimit;

    const { rows, count } = await db.Comment.findAndCountAll({
      where: { templateId },
      attributes: ['id', 'content', 'userId', 'createdAt'],
      include: [
        {
          model: db.User,
          attributes: ['username'],
        },
      ],
      limit: parsedLimit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'Template comments retrieved successfully',
      comments: rows?.map((comment) => ({
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        username: comment.User.username,
        createdAt: comment.createdAt,
      })),
      pagination: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / parsedLimit),
        prevPage:
          page > 1
            ? `/api/templates/${templateId}/comments?page=${parseInt(page) - 1}&limit=${parsedLimit}`
            : null,
        nextPage:
          page < Math.ceil(count / parsedLimit)
            ? `/api/templates/${templateId}/comments?page=${parseInt(page) + 1}&limit=${parsedLimit}`
            : null,
      },
    });
  } catch (error) {
    console.error('Error fetching template comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getTemplateComments;
