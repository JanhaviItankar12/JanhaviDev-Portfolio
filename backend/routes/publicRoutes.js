import express from "express";
import { sendMessage } from "../controller/public.js";
import {  getAllProjects, getExperiences } from "../controller/admin.js";



const router=express.Router();


router.post("/contact",sendMessage);
router.get("/projects", getAllProjects);
router.get("/experience", getExperiences);

export default router;