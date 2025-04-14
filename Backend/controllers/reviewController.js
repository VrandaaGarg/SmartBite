const db = require('../db');

const addReview = (req, res) => {
  const { Rating, Comment, CustomerID, DishID } = req.body;
  db.query(
    'INSERT INTO REVIEW (Rating, Comment, CreatedAt, CustomerID, DishID) VALUES (?, ?, NOW(), ?, ?)',
    [Rating, Comment, CustomerID, DishID],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Review submitted', reviewId: result.insertId });
    }
  );
};

module.exports = { addReview };
