import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/authRoutes.js"
import issueRoutes from './src/routes/issueRoutes.js'
import technicianRoutes from './src/routes/technicianRoutes.js'
import pendingIssuesRoutes from './src/routes/pendingIssuesRoutes.js'
import mapRoutes from "./src/routes/mapRoutes.js"

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/authUsers", userRoutes);
app.use("/api/issues",issueRoutes)
app.use("/api/technicians",technicianRoutes);
app.use("/api/pendingIssues",pendingIssuesRoutes);
app.use("/api/map", mapRoutes)

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});