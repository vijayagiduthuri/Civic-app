import express from "express";
import { registerUser, getUserByEmail } from "../controllers/userControllers.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/get-user", getUserByEmail);
export default router;
