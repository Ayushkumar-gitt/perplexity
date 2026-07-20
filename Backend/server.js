import connectToDb from "./config/database.js";
import { generateResponse } from "./services/ai.service.js";
import { initSocket } from "./sockets/server.socket.js";
import app from "./src/app.js";
import dns from 'dns'
import http from 'http'
dns.setServers(['8.8.8.8', '8.8.4.4']);

const httpServer = http.createServer(app)
initSocket(httpServer)
connectToDb()

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`server is running on port ${PORT}`);
})