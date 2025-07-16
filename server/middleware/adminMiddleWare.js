// middleware/admin.js
const jwt = require('jsonwebtoken');

const admin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Unauthorized: No token provided" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY); // Verify token with your secret key
    
    // Check if user is admin first
    if (!decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access only.",
      });
    }

    req.user = decoded; // Attach decoded payload to request only if admin
    next(); // Proceed to the protected route

  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ 
      success: false,
      message: "Unauthorized: Invalid or expired token" 
    });
  }
};

module.exports = admin;