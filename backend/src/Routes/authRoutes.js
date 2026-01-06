import express from "express";
import {
  Register,
  LogIn,
  EmailVerification,
  VerifyCode,
  ResetPassword,
} from "../Controllers/authController.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", LogIn);
router.post("/emailVerification", EmailVerification);
router.post("/verifyCode", VerifyCode);
router.post("/resetPassword", ResetPassword);

export default router;
