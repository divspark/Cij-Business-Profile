// middleware/auth.js
const jwt = require('jsonwebtoken');
const Company = require('../model/CompanySchema'); // Adjust the path as necessary

const authMiddleware = async (req, res, next) => {
  // Check if token is provided in headers
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure you have JWT_SECRET in your environment variables

    // Find the company using the ID from the token
    const company = await Company.findById(decoded.id);
    if (!company) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    // Attach company information to the request object
    req.company = { id: company._id, PrimaryEmail: company.PrimaryEmail };
    
    next(); // Call the next middleware or route handler
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
