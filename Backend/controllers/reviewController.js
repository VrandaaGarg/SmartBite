const db = require('../db');

// Add a review (requires DishID, CustomerID, Rating, Comment)
const addReview = (req, res) => {
  const { DishID, CustomerID, Rating, Comment } = req.body;

  if (!DishID || !CustomerID || !Rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.query(
    'INSERT INTO REVIEW (DishID, CustomerID, Rating, Comment) VALUES (?, ?, ?, ?)',
    [DishID, CustomerID, Rating, Comment],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Review added successfully', reviewId: result.insertId });
    }
  );
};

// Get all reviews for a dish
const getReviewsForDish = (req, res) => {
  const dishId = req.params.dishId;

  db.query(
    `SELECT r.*, c.Name AS CustomerName 
     FROM REVIEW r 
     JOIN CUSTOMER c ON r.CustomerID = c.CustomerID 
     WHERE r.DishID = ? 
     ORDER BY r.CreatedAt DESC`,
    [dishId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// Get all reviews by a customer
const getReviewsByCustomer = (req, res) => {
  const customerId = req.params.customerId;

  db.query(
    `SELECT r.*, d.Name AS DishName 
     FROM REVIEW r 
     JOIN DISH d ON r.DishID = d.DishID 
     WHERE r.CustomerID = ? 
     ORDER BY r.CreatedAt DESC`,
    [customerId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};
// 🔄 Update review by CustomerID & DishID
const updateReview = (req, res) => {
  const { DishID, CustomerID, Rating, Comment } = req.body;

  if (!DishID || !CustomerID || !Rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    UPDATE REVIEW
    SET Rating = ?, Comment = ?, CreatedAt = CURRENT_TIMESTAMP
    WHERE DishID = ? AND CustomerID = ?
  `;

  db.query(sql, [Rating, Comment, DishID, CustomerID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review updated successfully" });
  });
};

module.exports = {
  addReview,
  updateReview,
  getReviewsForDish,
  getReviewsByCustomer
};
