import express from "express";
import { authenticateToken } from '../../middleware/authMiddleware.js';
import getParticipants from "../../controllers/presentationControllers/getParticipants.js";
import changeParticipantRole from "../../controllers/presentationControllers/changeParticipantRole.js";
import removeParticipant from "../../controllers/presentationControllers/removeParticipant.js";
import getParticipantRoles from "../../controllers/presentationControllers/getParticipantRoles.js";
const router = express.Router();

// GET /api/participant/roles
router.get("/roles", authenticateToken, getParticipantRoles);

// GET /api/participant/:presentationId
router.get("/:presentationId", authenticateToken, getParticipants);


// PUT /api/participant/role/change/:participantId
router.put("/role/change/:presentationId/:userId", authenticateToken, changeParticipantRole);

// DELETE /api/participant/remove/:participantId/:userId
router.delete("/remove/:presentationId/:userId", authenticateToken, removeParticipant);

export default router;
