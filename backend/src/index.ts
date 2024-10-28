import "dotenv/config";
import "module-alias/register";
import express from "express";
import cors from "cors";
import { drizzle } from "drizzle-orm/libsql"; // Replace with the actual library name
import { createClient } from "@libsql/client/http"; // Replace with the actual library name
import { itemsTable } from "./db/schema";
import { eq } from "drizzle-orm";

const app = express();
app.use(cors());
app.use(express.json());

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "@upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single("file"), (req, res) => {
  console.log("POST upload", req);
  res.send("File uploaded successfully");
});

app.use('/upload', express.static("@upload"));

app.get('/upload', (req, res) => {
  res.send('Pasta de uploads acessível');
});

const db = drizzle(
  createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
);

app.get("/items", async (req, res) => {
  const items = await db.select().from(itemsTable).all();
  res.json(items);
});

app.post("/items", async (req, res) => {
  const item = req.body;
  console.log("POST item", item);
  await db.insert(itemsTable).values(item);
  res.status(201).send();
});

app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  await db.delete(itemsTable).where(eq(itemsTable.id, Number(id)));
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("API server running on http://localhost:3000");
});
