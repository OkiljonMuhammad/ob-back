import db from '../../models/index.js';

const createComment = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const newComment = await db.Comment.create({
      content,
      templateId,
      userId: req.user.id,
    });

    res.status(201).json({
      message: 'Comment created successfully',
      comment: newComment,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default createComment;
