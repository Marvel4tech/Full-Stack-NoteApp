import { Router } from "express";
import { getUser, login, register } from "../controllers/authControllers.js";
import { authenticateToken } from "../middleware/authToken.js";

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/get-user", authenticateToken, getUser)

export default router