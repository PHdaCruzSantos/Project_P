import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import itemsRouter from "./routes/itemsRoutes";
import storeRouter from "./routes/storesRoutes";
import clientRouter from "./routes/clientRoutes";
import paymentRouter from "./routes/paymentRoutes";
import shippingRouter from "./routes/shippingRoutes";
import orderRoutes from "./routes/orderRoutes";
import couponsRouter from "./routes/couponsRoutes";
import uploadRoutes from "./upload";

export const app = express();
const allowedOrigins = [
  process.env.LOCAL_HOST_ADM,
  process.env.LOCAL_HOST_CLIENT,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/api", userRouter);
app.use("/api", storeRouter);
app.use("/api", itemsRouter);
app.use("/api", clientRouter);
app.use("/api", shippingRouter);
app.use("/api", orderRoutes);
app.use("/api", couponsRouter);
app.use("/payment", paymentRouter);
app.use("/upload", uploadRoutes);
