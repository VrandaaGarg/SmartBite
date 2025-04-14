const db = require('../db');

const placeOrder = (req, res) => {
  const { CustomerID, items, Discount = 0 } = req.body;

  const orderSql = 'INSERT INTO ORDER_TABLE (CustomerID, Amount, Discount, Date, Time) VALUES (?, ?, ?, CURDATE(), CURTIME())';
  const orderItemsSql = 'INSERT INTO ORDER_ITEMS (OrderID, DishID, Quantity, Amount) VALUES ?';

  const totalAmount = items.reduce((sum, item) => sum + item.Price * item.Quantity, 0);

  db.query(orderSql, [CustomerID, totalAmount, Discount], (err, orderResult) => {
    if (err) return res.status(500).json({ error: err.message });

    const orderId = orderResult.insertId;
    const orderItems = items.map(item => [orderId, item.DishID, item.Quantity, item.Price]);

    db.query(orderItemsSql, [orderItems], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json({ message: 'Order placed', orderId });
    });
  });
};

module.exports = { placeOrder };
