import Comment from '../../models/Comment.js';

const getTemplateComments = async (req, res) => {
  try {
    const { templateId } = req.params;

    const { page = 1, limit = 10 } = req.query;
    const parsedLimit = parseInt(limit);
    const offset = (page - 1) * parsedLimit;

    const { rows, count } = await Comment.findAndCountAll({
      where: { templateId },
      attributes: ['id', 'content', 'userId', 'createdAt'],
      limit: parsedLimit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'Template comments retrieved successfully',
      comments: rows,
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
