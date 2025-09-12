import express from "express";
import {
  assignPendingIssue,
  getAllPendingIssues,
  deleteResolvedPendingIssues,
} from "../controllers/pendingIssuesControllers.js";

const router = express.Router();

router.post("/assign", assignPendingIssue);

router.get("/", getAllPendingIssues);

router.delete("/resolved", deleteResolvedPendingIssues);

export default router;
