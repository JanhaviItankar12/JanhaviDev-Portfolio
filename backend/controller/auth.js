import generateToken from "../middleware/generateToken.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";



// Simple regex for email validation
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Password strength: min 8 chars, 1 uppercase, 1 lowercase, 1 number
const isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

// Signup (create admin)
export const registerAdmin = async (req, res) => {
  try {
    let { fullName, email, password, confirmPassword } = req.body;
  

    // Trim inputs
    fullName = fullName?.trim();
    email = email?.trim();

    // 1️ Check if all fields are provided
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // 2️ Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 3️ Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 4️ Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, and 1 number",
      });
    }

    // 5️ Check if admin with this email already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // 6️ Create admin
    const admin = await Admin.create({ fullName, email, password });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- 1️ Validate input ---
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // --- 2️ Find admin ---
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // --- 3️ Check password ---
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // --- 4️ Generate JWT ---
    const token = generateToken(admin._id);

    // --- 5️ Set JWT in HTTP-only cookie ---
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only HTTPS in production
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // --- 6️ Return admin info (without token) ---
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProtectedAdmin = async (req, res) => {
  try {
    // 1️ Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // 2️ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️ Find admin
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // 4️ Return success
    return res.status(200).json({
      success: true,
      data: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // immediately expire
  });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};