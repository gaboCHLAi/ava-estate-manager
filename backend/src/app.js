import express from "express";
import cors from "cors";
import morgan from "morgan";
import lookuproutes from "./Routes/lookupRoutes.js";
import listingsroutes from "./Routes/listingsRoutes.js";
import authRoutes from "./Routes/authRoutes.js";

const app = express();

/* ---------------- MIDDLEWARES ---------------- */

// Logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json());

// Static files
app.use("/uploads", express.static("uploads"));

// CORS
const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: process.env.CORS, // live frontend URL
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

/* ---------------- GLOBAL ERROR HANDLER ---------------- */

app.use((err, req, res, next) => {
  console.error(err);

  if (process.env.NODE_ENV === "production") {
    res.status(500).json({ message: "Internal server error" });
  } else {
    res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
