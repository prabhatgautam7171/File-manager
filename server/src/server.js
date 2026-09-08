import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import folderRoutes from "./routes/folderRoute.js";
import fileRoutes from "./routes/fileRoute.js";


dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "File Manager API is running",
  });
});
//api
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} ✅`);
});
