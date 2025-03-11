import { Participant } from "../../models/presentationModels/index.js";
import "dotenv/config";

const changeParticipantRole = async (req, res) => {
  try {
    const { presentationId, userId } = req.params;
    const { newRole } = req.body;

    if (!req.user) {
      return res.status(403).json({ message: "You are not authorized to change participant roles" });
    }

    const creator = await Participant.findOne({
      where: { presentationId, userId: req.user.id, role: "Creator" },
    });

    if (!creator) {
      return res.status(403).json({ message: "Only the Creator can change participant roles" });
    }

    const participant = await Participant.findOne({
      where: { presentationId, userId },
    });

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    if (participant.role === "Creator") {
      return res.status(403).json({ message: "You cannot change the role of the Creator" });
    }

    const validRoles = ["Editor", "Viewer"];
    if (!validRoles.includes(newRole.roleName)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    await participant.update({ role: newRole.roleName });

    res.status(200).json({ message: "Participant role updated successfully" });
  } catch (error) {
    console.error("Error changing participant role:", error);
    res.status(500).json({ message: "Something went wrong, please try again.", error: error.message });
  }
};

export default changeParticipantRole;
