import { Router } from "express";
import { render_Chat } from "../controllers/chat.controller.js";
import { authToken, authorization } from "../utils.js";

const router = Router()

router.get('/chat', render_Chat)

export default router