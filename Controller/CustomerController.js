// controllers/customerController.js
const Customer = require("../model/CustomerSchema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

// Create a JWT token
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Signup API
const signup = async (req, res) => {
  const requiredFields = ["Name", "MobileNumber", "Email", "Pincode", "District", "Country", "password"];

  // Check for missing required fields
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({ success: false, message: `Please fill all required details: ${missingFields.join(', ')}` });
  }

  try {
    const customer = await Customer.create(req.body);
    
    // Generate a token
    const token = generateToken(customer._id, customer.Email);
    
    res.status(201).json({ success: true, message: "Customer registered successfully.", token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login API
const login = async (req, res) => {
  const { Email, password } = req.body;

  if (!Email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const customer = await Customer.findOne({ Email });
  if (!customer) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  const isPasswordMatched = await bcrypt.compare(password, customer.password);
  if (!isPasswordMatched) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  // Generate a token
  const token = generateToken(customer._id, customer.Email);
  
  res.status(200).json({ success: true, message: "Login successful.", token });
};

// Show Profile API
const showProfile = async (req, res) => {
  const customerId = req.customer.id; // Get customer ID from the token

  const customer = await Customer.findById(customerId).select("-password"); // Exclude password
  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found." });
  }

  res.status(200).json({ success: true, customer });
};

// Update Profile API
const updateProfile = async (req, res) => {
  const customerId = req.customer.id;

  const updatedCustomer = await Customer.findByIdAndUpdate(customerId, req.body, {
    new: true,
    runValidators: true,
    select: "-password" // Exclude password
  });

  if (!updatedCustomer) {
    return res.status(404).json({ success: false, message: "Customer not found." });
  }

  res.status(200).json({ success: true, customer: updatedCustomer });
};

// Delete Profile API
const deleteProfile = async (req, res) => {
  const customerId = req.customer.id;

  const deletedCustomer = await Customer.findByIdAndDelete(customerId);
  if (!deletedCustomer) {
    return res.status(404).json({ success: false, message: "Customer not found." });
  }

  res.status(200).json({ success: true, message: "Profile deleted successfully." });
};

// Forgot Password API
const forgotPassword = async (req, res) => {
  const { Email } = req.body;

  if (!Email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  const customer = await Customer.findOne({ Email });
  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found." });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and save the reset token in the database
  customer.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  customer.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Token valid for 30 minutes
  await customer.save();

  // Send email
  const resetUrl = `${process.env.FRONTEND_URL}/api/customer/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested to reset your password. Please make a PUT request to:\n\n ${resetUrl}`;

  await sendEmail({
    email: customer.Email,
    subject: "Password Reset Request",
    message,
  });

  res.status(200).json({ success: true, message: "Email sent for password reset." });
};

// Reset Password API
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const customer = await Customer.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!customer) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match." });
  }

  // Set new password
  customer.password = password; // Password will be hashed on save
  customer.resetPasswordToken = undefined;
  customer.resetPasswordExpire = undefined;
  await customer.save();

  res.status(200).json({ success: true, message: "Password reset successfully." });
};

// Update Password API
const updatePassword = async (req, res) => {
  const customerId = req.customer.id; // Assuming you are using middleware to attach customer info to req
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Old password and new password are required." });
  }

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found." });
  }

  const isPasswordMatched = await bcrypt.compare(oldPassword, customer.password);
  if (!isPasswordMatched) {
    return res.status(401).json({ success: false, message: "Old password is incorrect." });
  }

  customer.password = newPassword; // Password will be hashed on save
  await customer.save();

  res.status(200).json({ success: true, message: "Password updated successfully." });
};

module.exports = {
  signup,
  login,
  showProfile,
  updateProfile,
  deleteProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
};
