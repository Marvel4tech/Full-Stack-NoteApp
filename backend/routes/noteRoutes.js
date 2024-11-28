import { Router } from "express";
import { addNote, editNote } from "../controllers/noteControllers.js";
import { authenticateToken } from "../middleware/authToken.js";

const router = Router()

router.post("/add-note", authenticateToken, addNote)
router.put("/edit-note/:noteId", authenticateToken, editNote)

export default router;