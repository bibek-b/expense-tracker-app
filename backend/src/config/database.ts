import mongoose from "mongoose";
import dotenv from "dotenv";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/expense-tracker";

dotenv.config();
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
