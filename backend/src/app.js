// server.js
import express from "express";
import cors from "cors";
import lookuproutes from "./Routes/lookupRoutes.js";
import listingsroutes from "./Routes/listingsRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config(); // დარწმუნდი რომ dotenv გაქვს იმპორტირებული

const app = express();

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// CORS კონფიგურაცია
const allowedOrigins = [
  "https://ava-estate-manager.onrender.com", // შენი ფრონტენდი Render-ზე
  "http://localhost:5173", // ლოკალური ტესტირებისთვის
];

app.use(
  cors({
    origin: function (origin, callback) {
      // უფლებას ვაძლევთ იმ მისამართებს, რომლებიც სიაშია, ან თუ origin არ არის (მაგ: მობილური აპიდან)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// როუტები
app.use("/api", lookuproutes);
app.use("/api/listings", listingsroutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
