// middleware/verifyAdmin.js
const verifyAdmin = (req, res, next) => {
    // assumes verifyToken runs before this and sets req.user
    if (!req.user || !req.user.IsAdmin) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
  };
  
  module.exports = verifyAdmin;
  