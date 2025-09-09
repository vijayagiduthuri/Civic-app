import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/authUserRoutes/authRoutes.js"

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/authUsers", userRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
