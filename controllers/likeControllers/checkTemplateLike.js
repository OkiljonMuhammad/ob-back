import Likes from '../../models/Likes.js';

const CheckLikeTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    const existingLike = await Likes.findOne({
      where: {
        templateId,
        userId: req.user.id,
      },
    });

    if (existingLike) {
      return res.status(200).json({ message: true });
    } else {
      return res.status(200).json({ message: false });
    }
  } catch (error) {
    console.error('Error checking template like:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default CheckLikeTemplate;
