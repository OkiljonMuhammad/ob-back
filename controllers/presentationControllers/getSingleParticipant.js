import { User, Participant } from "../../models/presentationModels/index.js";
import "dotenv/config";

const getSingleParticipant = async (req, res) => {
  try {
    const { presentationId } = req.params;

    if (!req.user) {
      return res.status(403).json({ message: "You are not authorized to get participant data" });
    }

    const participant = await Participant.findOne({
      attributes: ["id", "role", "createdAt"],
      where: { userId: req.user.id, presentationId: presentationId },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.status(200).json({
      message: "Participant retrieved successfully",
      participant: {
        id: participant.User?.id || null,
        username: participant.User?.username || "Unknown",
        role: participant.role,
        createdAt: participant.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching participant:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getSingleParticipant;
