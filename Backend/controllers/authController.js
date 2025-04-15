const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      { CustomerID: user.CustomerID, Email: user.Email },
      JWT_SECRET,
      { expiresIn: "2d" }
    );

    // Don't send password back
    const { Password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  });
};

module.exports = { registerUser, loginUser };
