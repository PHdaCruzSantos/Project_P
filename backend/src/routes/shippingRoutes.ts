import { Router } from "express";
import { calculateShipping } from "../controllers/shippingController";

const shippingRouter = Router();
shippingRouter.post("/shipping/calculate", calculateShipping);

export default shippingRouter;
