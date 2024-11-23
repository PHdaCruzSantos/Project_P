import { Router } from "express";
import {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/controllers/userController";
import { authMiddleware } from "@/middlewares/authMiddleware";

const userRouter = Router();

userRouter.get("/user/:id", authMiddleware, getUserById);
userRouter.post("/user/create", createUser);
userRouter.put("/user/update/:id", authMiddleware, updateUser);
userRouter.delete("/user/delete/:id", authMiddleware, deleteUser);

export default userRouter;
