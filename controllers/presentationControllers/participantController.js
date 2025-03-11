import { Participant } from "../../models/presentationModels/index.js";

// Add a participant to a presentation
export const joinPresentation = async (req, res) => {
  try {
    const { nickname, presentationId } = req.body;

    const participant = await Participant.create({
      nickname,
      presentationId,
      role: "Viewer", // Default role
    });

    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({ error: "Failed to join presentation" });
  }
};

// Get all participants of a presentation
export const getParticipants = async (req, res) => {
  try {
    const { presentationId } = req.params;
    const participants = await Participant.findAll({
      where: { presentationId },
    });

    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch participants" });
  }
};

// Change a participant's role (Viewer <-> Editor)
export const changeRole = async (req, res) => {
  try {
    const { participantId, role } = req.body;

    const participant = await Participant.findByPk(participantId);
    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    participant.role = role;
    await participant.save();

    res.status(200).json({ message: "Role updated", participant });
  } catch (error) {
    res.status(500).json({ error: "Failed to update role" });
  }
};
