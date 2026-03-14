import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


import adminRoutes from "./routes/adminRoute.js";
import publicRoutes from "./routes/publicRoutes.js";

import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();



app.use(cors({
  origin: process.env.FRONTEND_URL, // your frontend URL
  credentials: true,               // allow cookies to be sent
}));


app.use(express.json());
app.use(cookieParser());

app.use("/api/public",publicRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));