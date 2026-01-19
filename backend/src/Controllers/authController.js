import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { sendEmail } from "./email.js"; // import the helper

export const Register = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;
    const checkQuery = "SELECT * FROM users WHERE email = $1";
    const checkResult = await pool.query(checkQuery, [email]);
    if (checkResult.rows.length > 0) {
      // თუ მომხმარებელი მოიძებნა, ვაჩერებთ პროცესს და ვაბრუნებთ შეცდომას
      return res
        .status(409)
        .json({ message: "მომხმარებელი ამ იმეილით უკვე არსებობს" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const q = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, last_name, email
    `;

    // აქ უნდა გამოვიყენოთ hashedPassword, არა raw password
    const result = await pool.query(q, [name, lastName, email, hashedPassword]);

    res
      .status(201)
      .json({ message: "რეგისტრაცია წარმატებულია", user: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "რეგისტრაცია ვერ შესრულდა" });
  }
};

export const LogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const q = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(q, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "user_not_found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalid_password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login წარმატებული",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "auth_failed" });
  }
};

export const EmailVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const emailQuery = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(emailQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "მომხმარებელი ვერ მოიძებნა" });
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const updateQuery = `UPDATE users SET reset_code = $1 WHERE email = $2`;
    await pool.query(updateQuery, [verificationCode, email]);

    // Use our new Brevo helper
    await sendEmail({
      to: email,
      subject: "Email Verification Code",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #3b82f6; letter-spacing: 5px;">${verificationCode}</h1>
          <p>Use this code to reset your password.</p>
        </div>
      `,
    });

    return res
      .status(200)
      .json({ message: "კოდი წარმატებით გაიგზავნა მეილზე" });
  } catch (error) {
    console.error("Email Verification Error:", error);
    return res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const VerifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    // 1. ამოვიღოთ მხოლოდ კოდი (მძიმე წავშალე reset_code-ის მერე)
    const userQuery = `SELECT reset_code FROM users WHERE email = $1`;
    const result = await pool.query(userQuery, [email]);

    const user = result.rows[0];

    const dbCode = String(user.reset_code).trim();
    const inputCode = String(code).trim();

    if (dbCode !== inputCode) {
      return res.status(400).json({ message: "არასწორი კოდი" });
    }

    console.log(
      "ბაზიდან მოსული:",
      user.reset_code.length,
      typeof user.reset_code,
    );
    console.log("შენს მიერ შეყვანილი:", code.length, typeof code);
    console.log("ბაზიდან მოსული:", user.reset_code, typeof user.reset_code);
    console.log("შენს მიერ შეყვანილი:", code, typeof code);

    await pool.query("UPDATE users SET reset_code = NULL WHERE email = $1", [
      email,
    ]);

    return res.status(200).json({ message: "ვერიფიკაცია წარმატებულია" });
  } catch (error) {
    console.error("ვერიფიკაციის შეცდომა:", error);
    // აქაც return დავამატე რომ headers_sent ერორი არ ამოგიგდოს
    return res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};
export const ResetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "მეილი და პაროლი აუცილებელია" });
    }

    // პაროლის ჰეშირება
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // პაროლის განახლება ბაზაში
    const query = `
      UPDATE users 
      SET password = $1
      WHERE email = $2
      RETURNING id, first_name, last_name, email
    `;

    const result = await pool.query(query, [hashedPassword, email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "მომხმარებელი ვერ მოიძებნა" });
    }

    return res.status(200).json({
      message: "პაროლი წარმატებით განახლდა",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("ResetPassword Error:", error);
    return res.status(500).json({ message: "პაროლის შეცვლა ვერ მოხერხდა" });
  }
};
