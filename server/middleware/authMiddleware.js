const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      console.log("Received token:", token);
      console.log("JWT_SECRET:", process.env.JWT_SECRET);
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded payload:", decoded);
  
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      console.error("JWT Verification Error:", err.message);
      res.status(401).json({ message: 'Token failed' });
    }
  };

module.exports = { protect };
