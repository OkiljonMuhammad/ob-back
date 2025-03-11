import { Participant } from "../../models/presentationModels/index.js";
import "dotenv/config";

const removeParticipant = async (req, res) => {
  try {
    const { presentationId, userId } = req.params;

    if (!req.user) {
      return res.status(403).json({ message: "You are not authorized to remove participants" });
    }

    const participant = await Participant.findOne({
      where: { presentationId, userId },
    });

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    if (participant.role === "Creator") {
      return res.status(403).json({ message: "You cannot remove the Creator" });
    }

    await participant.destroy();

    res.status(200).json({ message: "Participant removed successfully" });
  } catch (error) {
    console.error("Error removing participant:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default removeParticipant;
