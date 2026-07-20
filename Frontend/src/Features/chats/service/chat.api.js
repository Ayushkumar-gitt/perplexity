import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL:`${API_URL}/chats`,
    withCredentials:true
})

export async function sendMessage({message, chatId, file}){
    const formData = new FormData()
    formData.append('message', message)
    if (chatId) formData.append('chat', chatId)
    if (file) formData.append('file', file)

    const response = await api.post("/message", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export async function getChats(){
    const response = await api.get("/")
    return response.data
}

export async function getMessages(chatId){
    const response = await api.get(`/${chatId}/messages`)
    return response.data
}

export async function deleteChat(id){
    const response = await api.delete(`/${id}/delete`)
    return response.data
}
