import { Router } from "express";
import { addNote, deleteNote, editNote, getAllNotes, updateNotePinned } from "../controllers/noteControllers.js";
import { authenticateToken } from "../middleware/authToken.js";

const router = Router()

router.get("/get-all-notes", authenticateToken, getAllNotes)
router.post("/add-note", authenticateToken, addNote)
router.put("/edit-note/:noteId", authenticateToken, editNote)
router.delete("/delete-note/:noteId", authenticateToken, deleteNote)
router.put("/update-note-pinned/:noteId", authenticateToken, updateNotePinned)

export default router;