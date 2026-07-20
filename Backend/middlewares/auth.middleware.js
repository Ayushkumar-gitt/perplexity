import jwt from "jsonwebtoken";

export function authUser(request, response, next) {
    const token = request.cookies.token

    if (!token) {
        return response.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No token provided"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        request.user = decoded
        next()
    } catch (error) {
        return response.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        })
    }
} 