// src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Routes
import lookuproutes from "./Routes/lookupRoutes.js";
import listingsroutes from "./Routes/listingsRoutes.js";
import authRoutes from "./Routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Logging
app.use(morgan("dev"));

// Serve uploads
app.use("/uploads", express.static("uploads"));

// Body parser
app.use(express.json());

// CORS
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

// Catch-all for React SPA (Express 4 syntax!)
app.get("*", (req, res) => {
  res.sendFile(join(reactBuildPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
