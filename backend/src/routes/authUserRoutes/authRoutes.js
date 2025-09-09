import express from "express";
import { registerUser } from "../../controllers/authUsers/userControllers.js";
const router = express.Router();

router.post("/register", registerUser);
export default router;
