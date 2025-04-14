const db = require('../db');

const getAllDishes = (req, res) => {
  db.query('SELECT * FROM DISH', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports = { getAllDishes };
