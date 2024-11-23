import {
  getStores,
  addStore,
  deleteStore,
  desativeStore,
  updateStore,
  getStore,
} from "@/controllers/storesController";
import { Router } from "express";
import { authMiddleware } from "@/middlewares/authMiddleware";

const storeRouter = Router();

storeRouter.get("/stores-user/:userId", authMiddleware, getStores);
storeRouter.get("/store/:storeId", authMiddleware, getStore);
storeRouter.post("/stores/create/:userId", authMiddleware, addStore);
storeRouter.put("/stores/update/:storeId", authMiddleware, updateStore);
storeRouter.put("/stores/desative/:storeId", authMiddleware, desativeStore);
storeRouter.delete("/stores/delete/:storeId", authMiddleware, deleteStore);

export default storeRouter;
