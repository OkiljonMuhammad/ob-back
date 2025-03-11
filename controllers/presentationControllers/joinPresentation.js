import { Presentation, User, Participant } from "../../models/presentationModels/index.js";
import db from '../../models/index.js';

const joinPresentation = async (req, res) => {
  try {
    const { presentationId } = req.params;

    const presentation = await Presentation.findByPk(presentationId);
    if (!presentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }

    if (!req.user) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to join this presentation' });
    }

    const existingUserId = await Participant.findOne({
      where: { userId: req.user.id, presentationId: presentationId }
    });

    if (existingUserId) {
      return res
        .status(400)
        .json({ message: 'You are already joined this presentation' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      const newUser = await db.User.findByPk(req.user.id);
      await User.create({
        id: newUser.id,
        username: newUser.username,
      });
    }

    await Participant.create({
      role: 'Viewer',
      userId: req.user.id,
      presentationId: presentationId,
    });

    return res.status(200).json({
      message: 'You successfully joined',
    });
  } catch (error) {
    console.error('Error joining presentation:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default joinPresentation;
