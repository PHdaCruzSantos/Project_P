// API para salvar um arquivo de imagem nesta pasta de upload

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const router = express.Router();
// TODO: unificar a api com o index.tx para usar a mesma porta e não precisar de cors
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  res.json({ file: req.file });
});

router.delete("/upload/:filename", async (req, res) => {
  try {
    await unlinkAsync(path.join(__dirname, "uploads", req.params.filename));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
