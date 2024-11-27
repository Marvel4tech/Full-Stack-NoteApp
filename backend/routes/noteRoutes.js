import { Router } from "express";
import { addNote } from "../controllers/noteControllers.js";
import { authenticateToken } from "../middleware/authToken.js";

const router = Router()

router.post("/add-note", authenticateToken, addNote)

export default router;