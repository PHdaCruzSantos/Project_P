import { Router } from "express";
import { CouponsController } from "../controllers/couponsController";
import { authMiddleware } from "@/middlewares/authMiddleware";

const couponsRouter = Router();
const couponsController = new CouponsController();

// Create new coupon
couponsRouter.post(
  "/store/:storeId/coupons",
  authMiddleware,
  couponsController.create.bind(couponsController)
);

// Get all coupons from store
couponsRouter.get(
  "/store/:storeId/coupons",
  authMiddleware,
  couponsController.findAll.bind(couponsController)
);

// Get single coupon
couponsRouter.get(
  "/coupons/:id",
  authMiddleware,
  couponsController.findOne.bind(couponsController)
);

// Update coupon
couponsRouter.put(
  "/coupons/:id",
  authMiddleware,
  couponsController.update.bind(couponsController)
);

// Delete coupon
couponsRouter.delete(
  "/coupons/:id",
  authMiddleware,
  couponsController.delete.bind(couponsController)
);

export default couponsRouter;
