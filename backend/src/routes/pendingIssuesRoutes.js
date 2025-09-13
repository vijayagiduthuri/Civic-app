import express from "express";
import {
  assignPendingIssue,
  getAllPendingIssues,
} from "../controllers/pendingIssuesControllers.js";

const router = express.Router();

router.post("/assign", assignPendingIssue);

router.get("/", getAllPendingIssues);

export default router;
