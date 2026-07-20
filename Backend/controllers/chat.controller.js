import { generateChatTitle, generateResponse } from "../services/ai.service.js"
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"

export async function sendMessage(request, response) {
    const { message, chat: chatId } = request.body
    
    let fileUrl = null;
    if (request.file) {
        fileUrl = `http://localhost:3000/uploads/${request.file.filename}`;
    }

    let title = null, chat = null

    if (!chatId) {
        title = await generateChatTitle(message)
        chat = await chatModel.create({
            user: request.user.id,
            title: title
        })
    }

    const userMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: message,
        role: "user",
        ...(fileUrl && { fileUrl })
    })

    const allMessages = await messageModel.find({ chat: chatId || chat._id })

    const AiResponse = await generateResponse(allMessages, request.file?.path || null)

    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: AiResponse,
        role: "ai"
    })


    response.status(201).json({
        title: title,
        chat,
        aiMessage,
        userMessage
    })
}

export async function getChats(request, response) {
    const userId = request.user.id

    const chats = await chatModel.find({ user: userId })

    response.status(200).json({
        message: "chat retrieved successfully",
        chats
    })
}

export async function getMessages(request, response) {
    const { chatId } = request.params

    const chat = await chatModel.findOne({
        _id: chatId,
        user: request.user.id
    })

    if (!chat) {
        return response.status(404).json({
            message: "chat not found"
        })
    }

    const messages = await messageModel.find({ chat: chatId })

    response.status(200).json({
        message: "messages found",
        messages
    })
}

export async function deletechat(request, response) {
    const { chatId } = request.params

    const deleteChat = await chatModel.findOneAndDelete({ _id: chatId })
    if (deleteChat) {
        response.status(200).json({
            message: "Chat deleted successfully"
        })
    } else {
        return response.status(404).json({
            message: "Chat not found"
        })
    }

    await messageModel.deleteMany({ chat: chatId })


}