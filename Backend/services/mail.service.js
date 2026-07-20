import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID
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