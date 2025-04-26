// db.js
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // added port
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
  
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err.message);
    throw err;
  }
  console.log("✅ Connected to Railway MySQL Database");
});

module.exports = db;
