import { Presentation } from "../../models/presentationModels/index.js";
import { User } from "../../models/presentationModels/index.js";

const deletePresentation = async (req, res) => {
  try {
    const { presentationId } = req.params;

    const presentation = await Presentation.findByPk(presentationId);
    if (!presentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user || !user.id == presentation.creatorId) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this presentation' });
    }

    await presentation.destroy();

    return res.status(200).json({
      message: 'Presentation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting presentation:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default deletePresentation;
