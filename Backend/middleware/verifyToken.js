const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'smartbite-secret';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
