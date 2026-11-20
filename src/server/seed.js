import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";

// Replace these with the products from your old server.js / data file
// (keep name, price, description, image).
const products = [
  { name: "Wireless Headphones", price: 59.99, description: "Comfortable over-ear headphones.", image: "https://picsum.photos/seed/headphones/400/300" },
  { name: "Smart Watch", price: 129.0, description: "Track fitness and notifications.", image: "https://picsum.photos/seed/watch/400/300" },
  { name: "Backpack", price: 39.5, description: "Durable everyday backpack.", image: "https://picsum.photos/seed/backpack/400/300" },
];

await connectDB();

let seller = await User.findOne({ email: "seller@example.com" });
if (!seller) {
  seller = await User.create({ email: "seller@example.com", password: "seller123", role: "seller" });
  console.log("Created demo seller: seller@example.com / seller123");
}

if ((await Product.countDocuments()) === 0) {
  await Product.insertMany(products.map((p) => ({ ...p, seller: seller._id })));
  console.log(`Inserted ${products.length} products`);
} else {
  console.log("Products already exist, skipping");
}

await mongoose.disconnect();
