import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";


export const protect = async (req, res, next) => {
  try {
    // 1️ Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 2️ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️ Attach admin to request
    req.admin = await Admin.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};



