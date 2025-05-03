import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
const app = express();
const port = 8000;

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    // origin: "https://bharat-bank.netlify.app",
    credentials: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRETKEY,
});

import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const mongoUrl1 = process.env.MONGO_URL1;
const mongoUrl2 = process.env.MONGO_URL2;

main()
  .then(() => {
    console.log("Connection success");
  })
  .catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect(mongoUrl2);
// }

async function main() {
  await mongoose.connect(mongoUrl1);
}

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});
