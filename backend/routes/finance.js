const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.get('/summary', async (req, res) => {
  try {
    const deals = await prisma.deal.findMany({
      include: { car: { include: { expenses: true } }, customer: true },
      orderBy: { createdAt: "desc" }
    });

    const expenses = await prisma.expense.findMany({
      include: { car: true },
      orderBy: { date: "desc" }
    });

    res.json({ deals, expenses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/expense', async (req, res) => {
  try {
    const { carId, amount, description, expenseType, paidBy } = req.body;
    
    if (!carId) return res.status(400).json({ error: "Car must be selected" });

    const expense = await prisma.expense.create({
      data: {
        carId,
        amount: parseFloat(amount),
        description,
        expenseType,
        paidBy,
      },
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/deal', async (req, res) => {
  try {
    const { customerId, carId, finalPrice, paymentStatus } = req.body;

    if (!customerId || !carId) return res.status(400).json({ error: "Customer and Car must be selected" });

    const deal = await prisma.deal.create({
      data: {
        customerId,
        carId,
        finalPrice: parseFloat(finalPrice),
        paymentStatus,
      },
    });

    await prisma.car.update({
      where: { id: carId },
      data: { status: "Sold", finalSellPrice: parseFloat(finalPrice) },
    });

    await prisma.customer.update({
      where: { id: customerId },
      data: { stage: "Deal Closed" },
    });

    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
