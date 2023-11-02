import { createConversation, singleConversation } from "../controllers/conversationController.js";
import express from 'express';
const router = express();

router.post('/add', createConversation);
router.post("/get", singleConversation);

export default router;
