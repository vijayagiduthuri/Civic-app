import express from "express";
import { getCriticalRegionsCount } from "../controllers/mapControllers.js";
const router = express.Router();

router.get("/get-nearby-critical", getCriticalRegionsCount);
export default router;
