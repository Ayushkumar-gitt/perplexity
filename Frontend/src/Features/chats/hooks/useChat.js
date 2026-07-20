import { useDispatch } from "react-redux";
import { addMessages, addNewMessage, createNewChat, setChats, setCurrentChatId, setisLoading, replaceTempChat } from "../chat.slice";
import { deleteChat, getChats, getMessages, sendMessage } from "../service/chat.api";
import { initSocketConnection } from "../service/chat.socket";

export function useChat() {
    const dispatch = useDispatch()

    async function handleSendMessages({ message, chatId, file }) {
        // Generate a temporary file URL for optimistic display
        let tempFileUrl = null
        if (file) {
            tempFileUrl = URL.createObjectURL(file)
        }

        let targetChatId = chatId
        const isNewChat = !chatId
        let tempChatId = null

        if (isNewChat) {
            // Create a temporary chat so the user message has somewhere to render
            tempChatId = 'temp-' + Date.now()
            dispatch(createNewChat({ chatId: tempChatId, title: message.slice(0, 30) + (message.length > 30 ? '...' : '') }))
            dispatch(setCurrentChatId(tempChatId))
            targetChatId = tempChatId
        }

        // 1. Show user message IMMEDIATELY in the UI
        dispatch(addNewMessage({ 
            chatId: targetChatId, 
            content: message, 
            role: 'user', 
            fileUrl: tempFileUrl 
        }))

        // 2. Show loading/thinking animation
        dispatch(setisLoading(true))

        try {
            // 3. Wait for the backend (AI thinking happens here)
            const response = await sendMessage({ message, chatId, file })
            const { chat, aiMessage, userMessage } = response

            if (isNewChat && chat) {
                // Atomically replace the temp chat with the real server chat
                // This copies all messages (including the user msg we already added) to the real chat ID
                dispatch(replaceTempChat({ 
                    tempChatId, 
                    realChatId: chat._id, 
                    title: chat.title 
                }))
                // Now add the AI response to the real chat
                dispatch(addNewMessage({ chatId: chat._id, content: aiMessage, role: 'ai' }))
                dispatch(setCurrentChatId(chat._id))
            } else {
                // Existing chat — just add the AI response
                dispatch(addNewMessage({ chatId: targetChatId, content: aiMessage, role: 'ai' }))
            }
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            dispatch(setisLoading(false))
        }
    }

    async function handleGetChats() {
        dispatch(setisLoading(true))
        const response = await getChats()
        const { chats } = response
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt
            }
            return acc

        }, {})))
        dispatch(setisLoading(false))
    }

    async function handleOpenChat(chatId, chats) {
        if (chats[chatId]?.messages.length === 0) {
            const { messages } = await getMessages(chatId)
            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
                fileUrl: msg.fileUrl
            }))
            dispatch(addMessages({ chatId, messages: formattedMessages }))
            dispatch(setCurrentChatId(chatId))
        }
    }

    return {
        initSocketConnection,
        handleSendMessages,
        handleGetChats,
        handleOpenChat
    }
    
}

