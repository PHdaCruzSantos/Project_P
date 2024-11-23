import { app } from "./app";
import "dotenv/config";
import { createClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql";
import path from "path";
import express from "express";

export const db = drizzle(
  createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
);

// Serve static files from the uploads directory
app.use("/upload", express.static(path.join(__dirname, "@upload")));

app.listen(3000, () => {
  console.log("API server running on http://localhost:3000");
});
