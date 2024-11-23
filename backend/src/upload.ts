import express, { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadRoutes = Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../@upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if file already exists
    const filePath = path.join(uploadDir, file.originalname);
    if (fs.existsSync(filePath)) {
      cb(null, uploadDir); // File exists, proceed normally
    } else {
      cb(null, uploadDir); // File doesn't exist, save it
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

uploadRoutes.post(
  "/add-image",
  upload.single("file"),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check if file was actually saved
    const filePath = path.join(uploadDir, req.file.originalname);
    if (fs.existsSync(filePath)) {
      res.json({ message: "File uploaded successfully" });
    } else {
      res.status(500).json({ message: "Failed to save file" });
    }
  }
);

// Serve static files from the @upload directory
uploadRoutes.use("/images", express.static(uploadDir));

export default uploadRoutes;
