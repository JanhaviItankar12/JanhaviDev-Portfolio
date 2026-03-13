import express from "express";
import { registerAdmin, loginAdmin } from "../controller/auth.js";

const router = express.Router();

// Signup - only run once to create admin, or remove this route later
router.post("/signup", registerAdmin);

// Login - to get JWT token
router.post("/login", loginAdmin);



export default router;