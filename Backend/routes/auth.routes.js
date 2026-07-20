import { Router } from "express";
import { getme, loginUser, registerUser, verifyEmail, logoutUser } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../middlewares/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, registerUser);
authRouter.post("/login", loginValidator, loginUser)
authRouter.get("/verify-email", verifyEmail)
authRouter.get("/getme", authUser, getme)
authRouter.post("/logout", authUser, logoutUser)

export default authRouter;
