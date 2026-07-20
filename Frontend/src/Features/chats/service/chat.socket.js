import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function initSocketConnection() {
    const socket = io(API_URL, {
        withCredentials: true
    })

    socket.on("connect",()=>{
        console.log("User connected to IO server");
    })
}
