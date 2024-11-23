import { Router } from "express";
import { loginUser, loginClient, logout } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/login-user", loginUser);
authRouter.post("/login-client", loginClient);
authRouter.get("/logout", logout);

export default authRouter;
