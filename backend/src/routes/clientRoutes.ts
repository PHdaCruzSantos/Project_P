import { Router } from "express";
import {
  createClient,
  getClientById,
  updateClient,
  deleteClient,
} from "@/controllers/clientController";
import { authMiddleware } from "@/middlewares/authMiddleware";

const clientRouter = Router();

clientRouter.get("/client/:id", getClientById);
clientRouter.post("/client/create", createClient);
clientRouter.put("/client/update/:id", authMiddleware, updateClient);
clientRouter.delete("/client/delete/:id", authMiddleware, deleteClient);

export default clientRouter;
