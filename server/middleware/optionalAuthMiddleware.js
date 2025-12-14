const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Optional authentication middleware
 * Populates req.user if valid token exists, but doesn't fail if token is missing
 * Useful for public routes that can show different data for authenticated users
 */
const optionalAuth = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, continue without user (public access)
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token (exclude password)
    req.user = await User.findById(decoded.userId).select('-password');

    // Continue even if user not found (treat as public access)
    next();
  } catch (error) {
    // Invalid token, continue without user (public access)
    next();
  }
};

module.exports = optionalAuth;

