import { createAdmin } from "../controllers/adminControllers.js";
import express from 'express';

const router = express.Router();

router.post("/create-admin", createAdmin);

export default router;