const db = require('../db');

const addToCart = (req, res) => {
  const { CustomerID, DishID, Quantity, Amount } = req.body;
  db.query(
    'INSERT INTO CART (CustomerID, DishID, Quantity, Amount) VALUES (?, ?, ?, ?)',
    [CustomerID, DishID, Quantity, Amount],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Added to cart', cartId: result.insertId });
    }
  );
};

const getCartByCustomer = (req, res) => {
  const customerId = req.params.customerId;
  db.query(
    'SELECT c.*, d.Name, d.Image FROM CART c JOIN DISH d ON c.DishID = d.DishID WHERE c.CustomerID = ?',
    [customerId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

module.exports = { addToCart, getCartByCustomer };
