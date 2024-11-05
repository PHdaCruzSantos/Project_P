import "dotenv/config";
import "module-alias/register";
import express from "express";
import cors from "cors";
import { drizzle } from "drizzle-orm/libsql"; // Certifique-se de substituir pelo nome correto da biblioteca
import { createClient } from "@libsql/client/http"; // Certifique-se de substituir pelo nome correto da biblioteca
import { itemsTable, storesTable, usersTable } from "./db/schema"; // Inclui as novas tabelas
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

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

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("POST upload", req);
  res.send("File uploaded successfully");
});

app.use("/upload", express.static("@upload"));

app.get("/upload", (req, res) => {
  res.send("Pasta de uploads acessível");
});

// Configuração do banco de dados
const db = drizzle(
  createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
);

// Rotas para gerenciar itens

// GET: Obter todos os itens
app.get("/items", async (req, res) => {
  const items = await db.select().from(itemsTable).all();
  res.json(items);
});

// POST: Criar um novo item
app.post("/items", async (req, res) => {
  const item = req.body;
  console.log("POST item", item);
  await db.insert(itemsTable).values(item);
  res.status(201).send();
});

// DELETE: Deletar um item pelo ID (UUID)
app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  await db.delete(itemsTable).where(eq(itemsTable.id, id)); // Atualizado para UUID
  res.status(204).send();
});

// Rotas para gerenciar usuários

// GET: Obter todos os usuários
app.get("/users", async (req, res) => {
  const users = await db.select().from(usersTable).all();
  res.json(users);
});
// GET: Obter um usuário pelo ID (UUID)
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
  res.json(user);
});
// GET: Login de usuário
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), eq(usersTable.password, password)));

  res.json(user);
});

// POST: Criar um novo usuário
app.post("/users", async (req, res) => {
  const user = req.body;
  console.log("POST user", user);
  await db.insert(usersTable).values(user);
  res.status(201).send();
});

// DELETE: Deletar um usuário pelo ID (UUID)
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await db.delete(usersTable).where(eq(usersTable.id, id));
  res.status(204).send();
});

// Rotas para gerenciar lojas

// GET: Obter todas as lojas
app.get("/stores", async (req, res) => {
  const stores = await db.select().from(storesTable).all();
  res.json(stores);
});

// POST: Criar uma nova loja
app.post("/stores", async (req, res) => {
  const store = req.body;
  console.log("POST store", store);
  await db.insert(storesTable).values(store);
  res.status(201).send();
});

// DELETE: Deletar uma loja pelo ID (UUID)
app.delete("/stores/:id", async (req, res) => {
  const { id } = req.params;
  await db.delete(storesTable).where(eq(storesTable.id, id));
  res.status(204).send();
});

// GET: Obter todas as lojas de um usuário específico
app.get("/users/:userId/stores", async (req, res) => {
  const { userId } = req.params;
  const stores = await db
    .select()
    .from(storesTable)
    .where(eq(storesTable.user_id, userId))
    .all();
  res.json(stores);
});

// GET: Obter todos os itens de uma loja específica
app.get("/stores/:storeId/items", async (req, res) => {
  const { storeId } = req.params;
  const items = await db
    .select()
    .from(itemsTable)
    .where(eq(itemsTable.store_id, storeId))
    .all();
  res.json(items);
});

// Inicialização do servidor
app.listen(3000, () => {
  console.log("API server running on http://localhost:3000");
});

async function testDataGenerate() {
  const user1Id = uuidv4();
  const user2Id = uuidv4();

  await db.insert(usersTable).values({
    id: user1Id,
    name: "Alice",
    email: "alice@exemplo.com",
    password: "123456",
  });

  await db.insert(usersTable).values({
    id: user2Id,
    name: "Bob",
    email: "bob@exemplo.com",
    password: "123456",
  });

  const store1Id = uuidv4();
  const store2Id = uuidv4();

  await db.insert(storesTable).values({
    id: store1Id,
    name: "Alice's Store",
    address: "123 Main St",
    contact: "123-456-7890",
    user_id: user1Id,
  });

  await db.insert(storesTable).values({
    id: store2Id,
    name: "Bob's Store",
    address: "456 Elm St",
    contact: "098-765-4321",
    user_id: user2Id,
  });

  await db.insert(itemsTable).values({
    id: uuidv4(),
    name: "Item 1",
    price: 9.99,
    type: "A",
    description: "Description 1",
    store_id: store1Id,
    image_names: "1.png,2.png,3.png",
  });

  await db.insert(itemsTable).values({
    id: uuidv4(),
    name: "Item 2",
    price: 19.99,
    type: "B",
    description: "Description 2",
    store_id: store1Id,
    image_names: "4.png,5.png,6.png",
  });

  await db.insert(itemsTable).values({
    id: uuidv4(),
    name: "Item 3",
    price: 29.99,
    type: "C",
    description: "Description 3",
    store_id: store2Id,
    image_names: "7.png,8.png,9.png",
  });

  await db.insert(itemsTable).values({
    id: uuidv4(),
    name: "Item 4",
    price: 39.99,
    type: "D",
    description: "Description 4",
    store_id: store2Id,
    image_names: "10.png,11.png,12.png",
  });
}
