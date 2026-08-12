import nodemailer from "nodemailer";
import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);

// ---------------------------------------------------------------------------
// Lazy transporter — resolves smtp.gmail.com to an IPv4 address ourselves
// so nodemailer never gets a chance to pick an IPv6 address.
// Render's outbound IPv6 is blocked, which causes ENETUNREACH errors.
// ---------------------------------------------------------------------------

let _transporter = null;

async function getTransporter() {
    if (_transporter) return _transporter;

    // dns.resolve4 queries for A records only → guaranteed IPv4
    const ipv4Addresses = await resolve4('smtp.gmail.com');
    const smtpIp = ipv4Addresses[0];
    console.log(`Resolved smtp.gmail.com → ${smtpIp}`);

    _transporter = nodemailer.createTransport({
        host: smtpIp,            // raw IPv4 address — no DNS resolution needed
        port: 465,
        secure: true,
        auth: {
            user: process.env.GOOGLE_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        },
        tls: {
            servername: 'smtp.gmail.com'  // required for cert validation when host is an IP
        }
    });

    // Quick connectivity check (non-blocking)
    _transporter.verify()
        .then(() => console.log("Email transporter is ready"))
        .catch((err) => console.error("Email transporter verify failed:", err.message));

    return _transporter;
}

export async function sendEmail({ to, html, subject, text }) {
    const transporter = await getTransporter();
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        text,
        html
    };
    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent", details);
}