// controllers/cartController.js
const db = require('../db');

// ✅ Add item to cart
const addToCart = (req, res) => {
  const { CustomerID, DishID, Quantity, Amount } = req.body;

  // Check if item already exists in cart for that customer
  db.query(
    'SELECT * FROM CART WHERE CustomerID = ? AND DishID = ?',
    [CustomerID, DishID],
    (err, existing) => {
      if (err) return res.status(500).json({ error: err.message });

      if (existing.length > 0) {
        // Item exists, update quantity instead
        const newQty = existing[0].Quantity + Quantity;
        const newAmount = Amount; // optionally update this
        db.query(
          'UPDATE CART SET Quantity = ?, Amount = ? WHERE CustomerID = ? AND DishID = ?',
          [newQty, newAmount, CustomerID, DishID],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Cart item updated' });
          }
        );
      } else {
        // Insert new item
        db.query(
          'INSERT INTO CART (CustomerID, DishID, Quantity, Amount) VALUES (?, ?, ?, ?)',
          [CustomerID, DishID, Quantity, Amount],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Added to cart', cartId: result.insertId });
          }
        );
      }
    }
  );
};

// ✅ Get cart items for a customer
const getCartByCustomer = (req, res) => {
  const customerId = req.params.customerId;
  db.query(
    'SELECT c.*, d.Name, d.Image, d.Description, d.Price FROM CART c JOIN DISH d ON c.DishID = d.DishID WHERE c.CustomerID = ?',
    [customerId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// ✅ Update quantity of specific cart item
const updateCartItem = (req, res) => {
  const { CustomerID, DishID, Quantity } = req.body;
  if (Quantity <= 0) {
    // Auto-delete if quantity is 0
    db.query(
      'DELETE FROM CART WHERE CustomerID = ? AND DishID = ?',
      [CustomerID, DishID],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json({ message: 'Item removed from cart' });
      }
    );
  } else {
    db.query(
      'UPDATE CART SET Quantity = ? WHERE CustomerID = ? AND DishID = ?',
      [Quantity, CustomerID, DishID],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Cart item quantity updated' });
      }
    );
  }
};

// ✅ Remove specific item from cart
const removeCartItem = (req, res) => {
  const { CustomerID, DishID } = req.body;
  db.query(
    'DELETE FROM CART WHERE CustomerID = ? AND DishID = ?',
    [CustomerID, DishID],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Item removed from cart' });
    }
  );
};

// ✅ Clear cart for a customer
const clearCart = (req, res) => {
  const customerId = req.params.customerId;
  db.query(
    'DELETE FROM CART WHERE CustomerID = ?',
    [customerId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Cart cleared' });
    }
  );
};

module.exports = {
  addToCart,
  getCartByCustomer,
  updateCartItem,
  removeCartItem,
  clearCart
};
