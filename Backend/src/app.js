import 'dotenv/config';
import express from 'express'
import authRouter from '../routes/auth.routes.js';
import cookieParser from "cookie-parser"
import cors from 'cors'
import morgan from 'morgan'
import chatRouter from '../routes/chat.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// Dynamic CORS — allow Railway URL in production, localhost in dev
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, same-origin)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/auth', authRouter)
app.use("/chats",chatRouter)
app.use(morgan('dev'))

// Serve frontend static files in production
const frontendDistPath = path.join(__dirname, '../../Frontend/dist');
app.use(express.static(frontendDistPath));

// SPA catch-all — serve index.html for any route not matched by API
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

export default app
