// server.js
import express from "express";
import cors from "cors";
import lookuproutes from "./Routes/lookupRoutes.js";
import listingsroutes from "./Routes/listingsRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import morgan from "morgan";
const app = express();
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());

app.use("/api", lookuproutes);
app.use("/api/listings", listingsroutes);
app.use("/api/auth", authRoutes);
app.listen(5000, () => console.log("Server running on port 5000"));
