// middleware/customerAuth.js
const jwt = require('jsonwebtoken');
const Customer = require('../model/CustomerSchema'); // Adjust the path as necessary

const customerAuthMiddleware = async (req, res, next) => {
  // Check if token is provided in headers, query parameters, or body
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token || req.body.token;
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure you have JWT_SECRET in your environment variables

    // Find the customer using the ID from the token
    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    // Attach customer information to the request object
    req.customer = { id: customer._id, Email: customer.Email };
    
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error('Token verification error:', error); // Log error for debugging
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = customerAuthMiddleware;
