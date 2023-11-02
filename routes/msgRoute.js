import express from 'express';
import { addMsg, clearChat, deleteSingleMsg, getSingleChatMsg } from "../controllers/msgController.js";
const router = express();

router.post('/add', addMsg);
router.get("/get/:id", getSingleChatMsg);

router.delete("/delete/:id", deleteSingleMsg);
router.delete("/clearchat/:id", clearChat);

export default router;
