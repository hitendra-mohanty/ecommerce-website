import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import process from "node:process";

const router = Router();

const sign = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (u) => ({ id: u.id, email: u.email, role: u.role });

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, role = "buyer" } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });
    if (password.length < 6 || password.length > 20)
      return res.status(400).json({ message: "Password must be 6-20 characters" });
    if (!["buyer", "seller"].includes(role))
      return res.status(400).json({ message: "Invalid role" });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: "Email already exists" });

    const user = await User.create({ email, password, role });
    res.status(201).json({ token: sign(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = email && (await User.findOne({ email: email.toLowerCase() }));
    if (!user || !(await user.comparePassword(password || "")))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({ token: sign(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.get("/me", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "User no longer exists" });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
