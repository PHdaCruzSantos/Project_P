import express from "express";
import { NFEController } from "../controllers/NFeController";
import { authMiddleware } from "@/middlewares/authMiddleware";

const NFeRouter = express.Router();
const nfeController = new NFEController();

NFeRouter.post(
  "/emit/:orderId",
  authMiddleware,
  nfeController.emitNFE.bind(nfeController)
);

NFeRouter.get(
  "/status/:nfeId",
  authMiddleware,
  nfeController.getNFEStatus.bind(nfeController)
);

export default NFeRouter;
