import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "pdf-json",
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Connect to MongoDB
if (mongoose.connection.readyState === 0) {
  connectDB();
}

export default mongoose;
