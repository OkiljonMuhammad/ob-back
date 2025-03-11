import express from "express";
import { authenticateToken } from '../../middleware/authMiddleware.js';
import createPresentation from "../../controllers/presentationControllers/createPresentation.js";
import getAllPresentations from "../../controllers/presentationControllers/getAllPresentations.js";
import deletePresentation from "../../controllers/presentationControllers/deletePresentation.js";
import getSinglePresentation from "../../controllers/presentationControllers/getSinglePresentation.js";
import updatePresentation from "../../controllers/presentationControllers/updatePresentation.js";
import joinPresentation from "../../controllers/presentationControllers/joinPresentation.js";

const router = express.Router();

// POST api/presentation/create
router.post("/create", authenticateToken, createPresentation);


// GET api/presentation/presentations/public
router.get("/presentations/public", getAllPresentations);

// GET api/presentation/presentations
router.get("/presentations", authenticateToken, getAllPresentations);

// GET api/presentation/:presentationId
router.get("/:presentationId", authenticateToken, getSinglePresentation);

// DELETE api/presentation/:presentationId
router.delete("/:presentationId", authenticateToken, deletePresentation);

// PUT api/presentation/:presentationId
router.put("/:presentationId", authenticateToken, updatePresentation);

// POST api/presentation/:presentationId
router.post("/join/:presentationId", authenticateToken, joinPresentation);

export default router;
