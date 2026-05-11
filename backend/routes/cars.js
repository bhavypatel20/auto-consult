const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), '..', 'frontend', 'public', 'photos');
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

router.get('/', async (req, res) => {
  try {
    const cars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { clerkUserId, brand, model, fuelType, registrationNum, status, sellerName, sellerAddress } = req.body;
    const year = parseInt(req.body.year);
    const kmDriven = parseInt(req.body.kmDriven);
    const purchasePrice = parseFloat(req.body.purchasePrice);
    const expectedSellPrice = parseFloat(req.body.expectedSellPrice);
    
    let publicUrl = null;
    if (req.file) {
      publicUrl = `/photos/${req.file.filename}`;
    }

    const car = await prisma.car.create({
      data: {
        clerkUserId: clerkUserId || "default_user", // Fallback since auth might be disconnected
        brand, model, year, fuelType, kmDriven, registrationNum, status, 
        purchasePrice, expectedSellPrice, sellerName, sellerAddress,
        images: publicUrl,
      },
    });
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, model, fuelType, registrationNum, status, sellerName, sellerAddress } = req.body;
    
    const updateData = { brand, model, fuelType, registrationNum, status, sellerName, sellerAddress };
    if (req.body.year) updateData.year = parseInt(req.body.year);
    if (req.body.kmDriven) updateData.kmDriven = parseInt(req.body.kmDriven);
    if (req.body.purchasePrice) updateData.purchasePrice = parseFloat(req.body.purchasePrice);
    if (req.body.expectedSellPrice) updateData.expectedSellPrice = parseFloat(req.body.expectedSellPrice);

    if (req.file) {
      updateData.images = `/photos/${req.file.filename}`;
    }

    const car = await prisma.car.update({
      where: { id },
      data: updateData,
    });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/image', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const publicUrl = `/photos/${req.file.filename}`;
    const car = await prisma.car.findUnique({ where: { id } });
    
    let newImages = publicUrl;
    if (car?.images && car.images.length > 0) {
      newImages = `${car.images},${publicUrl}`;
    }

    const updatedCar = await prisma.car.update({
      where: { id },
      data: { images: newImages },
    });
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
