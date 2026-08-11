import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// --- OAuth2 approach (commented out — token expired) ---
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: process.env.GOOGLE_USER,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//         clientId: process.env.GOOGLE_CLIENT_ID
//     }
// })

// --- App Password approach (IPv4 forced for Render compatibility) ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465
    family: 4,    // force IPv4 — Render does not support IPv6 outbound
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
})

transporter.verify().then(() => {
    console.log("Email transporter is ready");
    
}).catch((error) => {
        console.error("Error occurred while verifying email transporter:", error);
    });

export async function sendEmail({ to, html, subject, text }) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        text,
        html
    }
    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent", details);

}