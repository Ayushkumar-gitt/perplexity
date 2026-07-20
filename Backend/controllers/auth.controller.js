import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from 'jsonwebtoken'

export async function registerUser(request, response) {
    const { username, email, password } = request.body;

    const isUserAlreadyExists = await userModel.findOne({ $or: [{ username }, { email }] });

    if (isUserAlreadyExists) {
        return response.status(400).json({
            success: false,
            message: "Username or email already exists",
            err: "User already exists"
        });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ username, email, password: hash });

    const emailToken = jwt.sign({
        email: user.email
    }, process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        html: `<p>Hello ${username},</p><p>Thank you for registering at <strong>Perplexity</strong>! We're excited to have you on board.</p>
        <a href="http://localhost:3000/auth/verify-email?token=${emailToken}">Click here to verify your email</a>
        <p>Best regards,<br>The Perplexity Team</p>`
    })

    response.status(201).json({
        message: "user registered successfully",
        status: true,
        user: {
            username: user.username,
            email: user.email
        }
    })
}

export async function verifyEmail(request, response) {
    const { token } = request.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findOne({ email: decoded.email })

    if (!user) {
        return response.status(400).json({
            message: "Invalid token",
            success: false,
            err: "User not found"
        })
    }

    user.verified = true

    await user.save()

    const html = "<h1>Email verified successfully</h1> <p>You can now login to your account.</p>"

    response.send(html)
}

export async function loginUser(request, response) {
    const { email, password } = request.body

    const user = await userModel.findOne({ email: email })

    if (!user) {
        return response.status(400).json({
            message: "Invalid user or password",
            success: false,
            err: "Invalid Credentials"
        })
    }

    const isPasswordvalid = await bcrypt.compare(password, user.password)

    if (!isPasswordvalid) {
        return response.status(400).json({
            message: "Invalid user or password",
            success: false,
            err: "Invalid Credentials"
        })
    }
    if (!user.verified) {
        return response.status(400).json({
            message: "Email is not verified",
            success: false,
            err: "user is not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET)

    response.cookie("token", token)

    response.status(200).json({
        message: "user logged in successfully",
        success: true,
        user: {
            username: user.username,
            email: user.email
        }
    })
}

export async function getme(request, response) {
    const userId = request.user.id

    const user = await userModel.findById(userId).select("-password")

    if (!user) {
        return response.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    response.status(200).json({
        message: "user fetched successfully",
        success: true,
        user
    })
}

export async function logoutUser(request, response) {
    response.clearCookie("token")
    response.status(200).json({
        message: "user logged out successfully",
        success: true
    })
}