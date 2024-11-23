import express, { Router } from "express";
import multer from "multer";
import path from "path";

const uploadRoutes = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

uploadRoutes.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded successfully");
});

// Serve static files from the uploads directory
uploadRoutes.use("/images", express.static("@upload"));

export default uploadRoutes;
