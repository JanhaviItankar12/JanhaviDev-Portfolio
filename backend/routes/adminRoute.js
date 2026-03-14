import express from "express";
import { registerAdmin, loginAdmin } from "../controller/auth.js";
import { createExperience, createProject, deleteExperience, deleteMessage, deleteProject,  getExperienceById,   getMessages,  getProjectById, markMessageAsRead, updateExperience, updateProject } from "../controller/admin.js";
import { protect } from "../middleware/protect.js";
import upload from "../middleware/upload.js";


const router = express.Router();

// Signup - only run once to create admin, or remove this route later
router.post("/signup", registerAdmin);

// Login - to get JWT token
router.post("/login", loginAdmin);

router.post("/projects",protect,upload.single("image"), createProject);
router.get("/projects/:id", protect,getProjectById);
router.put("/projects/:id",protect, updateProject);
router.delete("/projects/:id", protect,deleteProject);

router.get("/messages",protect,getMessages);
router.patch("/message/:id/read",protect,markMessageAsRead);
router.delete("/message/:id", protect, deleteMessage);

router.post("/experience", protect, createExperience);
router.get("/experience/:id",protect, getExperienceById);
router.put("/experience/:id", protect, updateExperience);
router.delete("/experience/:id", protect, deleteExperience);


export default router;