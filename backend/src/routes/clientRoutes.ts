import { Router } from "express";
import {
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  addFavItem,
  removeFavItem,
  getFavorites,
  getClientAddresses,
  createClientAddress,
  updateClientAddress,
  deleteClientAddress,
  addCart,
  removeCart,
  getCartByClientId,
} from "@/controllers/clientController";
import { authMiddleware } from "@/middlewares/authMiddleware";

const clientRouter = Router();

clientRouter.get("/client/:id", getClientById);
clientRouter.post("/client/create", createClient);
clientRouter.put("/client/update/:id", authMiddleware, updateClient);
clientRouter.delete("/client/delete/:id", authMiddleware, deleteClient);
clientRouter.get(
  "/client/:clientId/addresses",
  authMiddleware,
  getClientAddresses
);
clientRouter.post(
  "/client/:clientId/address",
  authMiddleware,
  createClientAddress
);
clientRouter.put(
  "/client/:clientId/address/:addressId",
  authMiddleware,
  updateClientAddress
);
clientRouter.delete(
  "/client/:clientId/address/:addressId",
  authMiddleware,
  deleteClientAddress
);

clientRouter.post(
  "/client/:clientId/favorite/:itemId",
  authMiddleware,
  addFavItem
);
clientRouter.delete(
  "/client/:clientId/favorite/:itemId",
  authMiddleware,
  removeFavItem
);
clientRouter.get("/client/:clienteId/favorites", authMiddleware, getFavorites);

clientRouter.post("/client/:clientId/cart/:itemId", authMiddleware, addCart);
clientRouter.delete(
  "/client/:clientId/cart/:itemId",
  authMiddleware,
  removeCart
);
clientRouter.get("/client/:clientId/cart", authMiddleware, getCartByClientId);

export default clientRouter;
