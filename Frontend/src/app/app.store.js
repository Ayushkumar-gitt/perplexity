import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../Features/auth/authSlice"
import chatReducer from "../Features/chats/chat.slice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer
    }
})
