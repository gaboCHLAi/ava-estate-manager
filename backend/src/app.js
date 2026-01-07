import express from "express";
import cors from "cors";
import lookuproutes from "./Routes/lookupRoutes.js";
import listingsroutes from "./Routes/listingsRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Logging
app.use(morgan("dev"));

// Static uploads folder
app.use("/uploads", express.static("uploads"));

// JSON + CORS
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);

// API routes
app.use("/api", lookuproutes);
app.use("/api/listings", listingsroutes);
app.use("/api/auth", authRoutes);

// Serve React build
const reactBuildPath = join(__dirname, "../../frontend/dist");
app.use(express.static(reactBuildPath));

// Catch-all route for SPA (React)
app.get("*", (req, res) => {
  res.sendFile(join(reactBuildPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
