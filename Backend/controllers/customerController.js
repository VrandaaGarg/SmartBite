const db = require('../db');

const getAllCustomers = (req, res) => {
  db.query('SELECT * FROM CUSTOMER', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports = { getAllCustomers };
