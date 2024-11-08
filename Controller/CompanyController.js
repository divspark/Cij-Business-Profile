const Company = require("../model/CompanySchema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const authMiddleware = require("../middleware/CompanyAuth"); // Adjust the path as necessary

dotenv.config();

// Create a JWT token
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Signup API
const signup = async (req, res) => {
  const requiredFields = [
    "CompanyName",
    "ContactPersonName",
    "PrimaryMobileNumber",
    "Email",
    "Pincode",
    "District",
    "Country",
    "City",
    "State",
    "BuildingNumberOrFloor",
    "GSTIN",
    "PrimaryBusinessType",
    "CEOName",
    "GSTRegistrationDate",
    "OwnershipType",
    "password",
  ];

  // Check for missing required fields
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Please fill all required details: ${missingFields.join(", ")}`,
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Create the company with hashed password
  const company = await Company.create({
    ...req.body,
    password: hashedPassword,
  });

  // Generate a token
  const token = generateToken(company._id, company.Email);

  res.status(201).json({
    success: true,
    message: "Company registered successfully.",
    token,
  });
};

// Login API
const login = async (req, res) => {
  try {
    const { Email, password } = req.body;

    if (!Email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const company = await Company.findOne({ Email });
    if (!company) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const isPasswordMatched = await bcrypt.compare(password, company.password);
    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    // Generate a token
    const token = generateToken(company._id, company.Email);

    res
      .status(200)
      .json({ success: true, message: "Login successful.", token });
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Show Profile API
const showProfile = async (req, res) => {
  const companyId = req.company.id; // Get company ID from the token

  const company = await Company.findById(companyId);
  if (!company) {
    return res
      .status(404)
      .json({ success: false, message: "Company not found." });
  }

  res.status(200).json({ success: true, company });
};

// Update Profile API
const updateProfile = async (req, res) => {
  const companyId = req.company.id;
  const requiredFields = [
    "CompanyName",
    "ContactPersonName",
    "PrimaryMobileNumber",
    "Email",
    "Pincode",
    "District",
    "Country",
    "City",
    "State",
    "BuildingNumberOrFloor",
    "GSTIN",
    "PrimaryBusinessType",
    "CEOName",
    "GSTRegistrationDate",
    "OwnershipType",
  ];

  // Check for missing required fields
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Please fill all required details: ${missingFields.join(", ")}`,
    });
  }

  const updatedCompany = await Company.findByIdAndUpdate(companyId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedCompany) {
    return res
      .status(404)
      .json({ success: false, message: "Company not found." });
  }

  res.status(200).json({ success: true, company: updatedCompany });
};

// Delete Profile API
const deleteProfile = async (req, res) => {
  const companyId = req.company.id;

  const deletedCompany = await Company.findByIdAndDelete(companyId);
  if (!deletedCompany) {
    return res
      .status(404)
      .json({ success: false, message: "Company not found." });
  }

  res
    .status(200)
    .json({ success: true, message: "Profile deleted successfully." });
};

// Forgot Password API
const forgotPassword = async (req, res) => {
  const { Email } = req.body;

  if (!Email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  const company = await Company.findOne({ Email });
  if (!company) {
    return res
      .status(404)
      .json({ success: false, message: "Company not found." });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and save the reset token in the database
  company.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  company.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Token valid for 30 minutes
  await company.save();

  // Send email
  const resetUrl = `${process.env.FRONTEND_URL}/api/company/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested to reset your password. Please make a PUT request to:\n\n ${resetUrl}`;

  await sendEmail({
    email: company.Email,
    subject: "Password Reset Request",
    message,
  });

  res
    .status(200)
    .json({ success: true, message: "Email sent for password reset." });
};

// Reset Password API
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const company = await Company.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!company) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired reset token." });
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match." });
  }

  // Set new password
  company.password = await bcrypt.hash(password, 10); // Hash the new password
  company.resetPasswordToken = undefined;
  company.resetPasswordExpire = undefined;
  await company.save();

  res
    .status(200)
    .json({ success: true, message: "Password reset successfully." });
};

// Update Password API
const updatePassword = async (req, res) => {
  const companyId = req.company.id; // Assuming you are using middleware to attach company info to req
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Old password and new password are required.",
    });
  }

  const company = await Company.findById(companyId);
  if (!company) {
    return res
      .status(404)
      .json({ success: false, message: "Company not found." });
  }

  const isPasswordMatched = await bcrypt.compare(oldPassword, company.password);
  if (!isPasswordMatched) {
    return res
      .status(401)
      .json({ success: false, message: "Old password is incorrect." });
  }

  company.password = await bcrypt.hash(newPassword, 10); // Hash the new password
  await company.save();

  res
    .status(200)
    .json({ success: true, message: "Password updated successfully." });
};


const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find(); // Fetch all companies

    if (!companies || companies.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No companies found." });
    }

    res.status(200).json({
      success: true,
      message: "Companies fetched successfully.",
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
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
  getAllCompanies
};
