import Likes from '../../models/Likes.js';

const removeLike = async (req, res) => {
  try {
    const { templateId } = req.params;

    const like = await Likes.findOne({
      where: {
        templateId,
        userId: req.user.id,
      },
    });

    if (!like) {
      return res
        .status(404)
        .json({ message: 'You have not liked this template' });
    }

    await like.destroy();

    res.status(200).json({
      message: 'Like removed successfully',
    });
  } catch (error) {
    console.error('Error removing like:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default removeLike;
