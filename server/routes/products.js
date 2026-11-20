import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
const pick = (b) => ({
  name: b.name,
  price: b.price,
  description: b.description,
  image: b.image,
});

// Public: all products
router.get("/", async (_req, res, next) => {
  try {
    res.json(await Product.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

// Seller: their own products (must be before "/:id")
router.get("/mine", protect, requireRole("seller"), async (req, res, next) => {
  try {
    res.json(await Product.find({ seller: req.user.id }).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(404).json({ message: "Product not found" });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post("/", protect, requireRole("seller"), async (req, res, next) => {
  try {
    const product = await Product.create({ ...pick(req.body), seller: req.user.id });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", protect, requireRole("seller"), async (req, res, next) => {
  try {
    const product = mongoose.isValidObjectId(req.params.id)
      ? await Product.findById(req.params.id)
      : null;
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your product" });

    Object.entries(pick(req.body)).forEach(([k, v]) => v !== undefined && (product[k] = v));
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protect, requireRole("seller"), async (req, res, next) => {
  try {
    const product = mongoose.isValidObjectId(req.params.id)
      ? await Product.findById(req.params.id)
      : null;
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your product" });

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
