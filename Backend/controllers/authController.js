const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || 'smartbite-secret';

const registerUser = async (req, res) => {
  const {
    Name, Email, Phone, Password,
    HouseNo, Street, Landmark, City, State, Pincode
  } = req.body;

  try {
    const hashed = await bcrypt.hash(Password, 10);

    const sql = `
      INSERT INTO CUSTOMER (Name, Email, Phone, Password, HouseNo, Street, Landmark, City, State, Pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [Name, Email, Phone, hashed, HouseNo, Street, Landmark, City, State, Pincode], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Email or phone already in use" });
      }

      res.status(201).json({ message: "Registration successful", customerId: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const loginUser = (req, res) => {
  const { Email, Password } = req.body;

  db.query(`SELECT * FROM CUSTOMER WHERE Email = ?`, [Email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];
    const match = await bcrypt.compare(Password, user.Password);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        CustomerID: user.CustomerID,
        Email: user.Email,
        IsAdmin: user.IsAdmin, // ✅ INCLUDED
      },
      JWT_SECRET,
      { expiresIn: "2d" }
    );

    const { Password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  });
};

// =====================
// Nodemailer Transport
// =====================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================
// Forgot Password
// =====================
const forgotPassword = (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min from now

  const findUserSql = "SELECT * FROM CUSTOMER WHERE Email = ?";
  db.query(findUserSql, [email], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ error: "No user found with this email" });
    }

    const updateSql = "UPDATE CUSTOMER SET ResetToken = ?, TokenExpiry = ? WHERE Email = ?";
    db.query(updateSql, [token, expiry, email], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: "Could not save reset token" });
      }

      const resetLink = `http://localhost:5173/reset-password?token=${token}`; // replace in prod

      const mailOptions = {
        from: `"SmartBite Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your SmartBite Password",
        html: `
          <p>Hello 👋</p>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <a href="${resetLink}" style="background:#ef4444;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
            Reset Password
          </a>
          <p>This link will expire in 15 minutes. If you didn't request this, you can ignore the email.</p>
          <br/>
          <p>🍽️ With love, <br/>SmartBite Team</p>
        `,
      };

      transporter.sendMail(mailOptions, (emailErr, info) => {
        if (emailErr) {
          console.error("Email error:", emailErr);
          return res.status(500).json({ error: "Failed to send email" });
        }
        res.json({ message: "Reset link sent to your email!" });
      });
    });
  });
};

// Reset Password logic remains same as before
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const sql = "SELECT * FROM CUSTOMER WHERE ResetToken = ?";
  db.query(sql, [token], async (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const user = result[0];
    if (new Date(user.TokenExpiry) < new Date()) {
      return res.status(400).json({ error: "Token expired" });
    }

    try {
      const hashed = await bcrypt.hash(password, 10);
      const updateSql = `
        UPDATE CUSTOMER 
        SET Password = ?, ResetToken = NULL, TokenExpiry = NULL 
        WHERE CustomerID = ?
      `;
      db.query(updateSql, [hashed, user.CustomerID], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: "Failed to update password" });
        }
        res.json({ message: "Password updated successfully" });
      });
    } catch (e) {
      res.status(500).json({ error: "Server error during password reset" });
    }
  });
};

//Update Profile
const updateProfile = async (req, res) => {
  const {
    Email,
    Name,
    Phone,
    HouseNo,
    Street,
    Landmark,
    City,
    State,
    Pincode
  } = req.body;

  if (!Email) {
    return res.status(400).json({ error: "Email is required for updating profile." });
  }

  try {
    const [result] = await db.promise().query(
      `UPDATE CUSTOMER
       SET Name = ?, Phone = ?, HouseNo = ?, Street = ?, Landmark = ?, City = ?, State = ?, Pincode = ?
       WHERE Email = ?`,
      [Name, Phone, HouseNo, Street, Landmark, City, State, Pincode, Email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // Fetch updated user data
    const [updatedUser] = await db.promise().query(
      `SELECT * FROM CUSTOMER WHERE Email = ?`,
      [Email]
    );

    res.status(200).json({
      message: "Profile updated successfully",
      updatedUser: updatedUser[0],
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};


module.exports = {
  registerUser, loginUser, forgotPassword,
  resetPassword,updateProfile
};
