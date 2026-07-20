import { Server } from 'socket.io'

let io;

export function initSocket(httpserver) {
    const allowedOrigins = [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ].filter(Boolean);

    io = new Server(httpserver, {
        cors: {
            origin: allowedOrigins,
            credentials: true
        }
    })
    console.log("Socket io server is running");

    io.on("connection", (socket) => {
        console.log("New connection established , Connection Id - ", socket.id);
    })
}

export function getIo() {
    if (!io) {
        return console.log("socket not initialised");
    }
    return io
}