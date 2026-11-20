import { Router } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

// Buyer places an order. Prices are read from the DB, never trusted from the client.
router.post("/", protect, requireRole("buyer"), async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const ids = items.map((i) => i.productId).filter((id) => mongoose.isValidObjectId(id));
    const products = await Product.find({ _id: { $in: ids } });
    const byId = new Map(products.map((p) => [p.id, p]));

    const orderItems = [];
    for (const item of items) {
      const product = byId.get(String(item.productId));
      const quantity = Number(item.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1)
        return res.status(400).json({ message: "Invalid item in cart" });
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({ buyer: req.user.id, items: orderItems, total });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get("/mine", protect, requireRole("buyer"), async (req, res, next) => {
  try {
    res.json(await Order.find({ buyer: req.user.id }).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

export default router;
