import express from 'express'
import { registerTechnician,getAllTechnicians } from '../controllers/technicianControllers.js'

const router = express.Router();

router.post("/register", registerTechnician);

router.get("/", getAllTechnicians);

export default router;