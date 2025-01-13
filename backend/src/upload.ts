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
  upload.array("files", 10), // Changed to handle multiple files, max 10
  (req: Request, res: Response) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = Array.isArray(req.files) ? req.files : [req.files];
    const fileNames = uploadedFiles.map((file) => file.originalname);

    res.json({
      message: "Files uploaded successfully",
      files: fileNames,
    });
  }
);

// Serve static files from the @upload directory
uploadRoutes.use("/images", express.static(uploadDir));

export default uploadRoutes;
