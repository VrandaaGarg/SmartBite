const db = require('../db');

// Place order - already implemented
const placeOrder = (req, res) => {
  const { CustomerID, items, Discount = 0 } = req.body;
  const totalAmount = items.reduce((sum, item) => sum + item.Price * item.Quantity, 0);

  const orderSql = 'INSERT INTO ORDER_TABLE (CustomerID, Amount, Discount) VALUES (?, ?, ?)';
  const orderItemsSql = 'INSERT INTO ORDER_ITEMS (OrderID, DishID, Quantity, Amount) VALUES ?';

  db.query(orderSql, [CustomerID, totalAmount, Discount], (err, orderResult) => {
    if (err) return res.status(500).json({ error: err.message });

    const orderId = orderResult.insertId;
    const orderItems = items.map(item => [orderId, item.DishID, item.Quantity, item.Price * item.Quantity]);

    db.query(orderItemsSql, [orderItems], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json({ message: 'Order placed', orderId });
    });
  });
};

const getOrdersByCustomer = (req, res) => {
  const { customerId } = req.params;

  const orderSql = `
    SELECT * FROM ORDER_TABLE
    WHERE CustomerID = ?
    ORDER BY OrderID DESC
  `;

  const orderItemsSql = `
    SELECT oi.*, d.Name, d.Image, d.Description, d.Price
    FROM ORDER_ITEMS oi
    JOIN DISH d ON oi.DishID = d.DishID
    WHERE oi.OrderID = ?
  `;

  const reviewSql = `
    SELECT * FROM REVIEW
    WHERE CustomerID = ?
  `;

  db.query(orderSql, [customerId], (err, orders) => {
    if (err) return res.status(500).json({ error: "Failed to fetch orders" });

    // First get all reviews by this customer
    db.query(reviewSql, [customerId], (reviewErr, reviews) => {
      if (reviewErr) return res.status(500).json({ error: "Failed to fetch reviews" });

      const ordersWithItems = [];

      const fetchItems = (index) => {
        if (index >= orders.length) {
          return res.json(ordersWithItems);
        }

        const order = orders[index];

        db.query(orderItemsSql, [order.OrderID], (err2, items) => {
          if (err2) return res.status(500).json({ error: "Failed to fetch order items" });

          // Map reviews to each dish in the order
          const enrichedItems = items.map((item) => ({
            id: item.OrderItemID,
            DishID: item.DishID,
            name: item.Name,
            image: item.Image,
            description: item.Description,
            quantity: item.Quantity,
            price: item.Price,
            review: reviews.find(r => r.DishID === item.DishID) || null
          }));

          ordersWithItems.push({
            ...order,
            items: enrichedItems,
            createdAt: order.CreatedAt
          });

          fetchItems(index + 1);
        });
      };

      fetchItems(0);
    });
  });
};






module.exports = {
  placeOrder,
  getOrdersByCustomer
};