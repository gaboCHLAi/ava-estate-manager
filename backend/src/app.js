import express from "express";
import cors from "cors";
import morgan from "morgan";
import lookuproutes from "./Routes/lookupRoutes.js";
import listingsroutes from "./Routes/listingsRoutes.js";
import authRoutes from "./Routes/authRoutes.js";

const app = express();

/* ---------------- MIDDLEWARES ---------------- */

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());

// CORS
const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: process.env.CORS,
        credentials: true,
      }
    : {
        origin: "http://localhost:5173",
        credentials: true,
      };

app.use(cors(corsOptions));

/* ---------------- ROUTES ---------------- */
app.use("/api", lookuproutes);
app.use("/api/listings", listingsroutes);
app.use("/api/auth", authRoutes);

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
