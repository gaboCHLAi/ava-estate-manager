import express from "express";
import cors from "cors";
import path from "path";
import lookuproutes from "./Routes/lookupRoutes.js";
import listingsroutes from "./Routes/listingsRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import morgan from "morgan";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use("/api", lookuproutes);
app.use("/api/listings", listingsroutes);
app.use("/api/auth", authRoutes);

// Serve React build (frontend/dist)
app.use(express.static(path.join(process.cwd(), "frontend/dist")));

// Catch-all for SPA (React routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend/dist/index.html"));
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
