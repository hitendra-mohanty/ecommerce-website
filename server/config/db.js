import mongoose from "mongoose";
import process from "node:process";


export default async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
}
