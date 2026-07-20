import {Router} from 'express';
import { authUser } from '../middlewares/auth.middleware.js';
import { deletechat, getChats, getMessages, sendMessage } from '../controllers/chat.controller.js';
import upload from '../config/multer.js';

const chatRouter = Router();

chatRouter.post("/message", authUser, upload.single('file'), sendMessage)
chatRouter.get('/',authUser,getChats)
chatRouter.get("/:chatId/messages",authUser,getMessages)

chatRouter.delete("/:chatId/delete",authUser,deletechat)
export default chatRouter