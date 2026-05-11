const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer for document uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), '..', 'frontend', 'public', 'documents');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const safeFilename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_")}`;
    cb(null, safeFilename);
  }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { carId } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const publicUrl = `/documents/${req.file.filename}`;

    const car = await prisma.car.update({
      where: { id: carId },
      data: { documents: publicUrl },
    });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
