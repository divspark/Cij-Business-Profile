const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CustomerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },

  MobileNumber: {
    type: String,
    required: true,
  },

  Email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },

  Pincode: {
    type: String,
    required: true,
  },

  District: {
    type: String,
    required: true,
  },

  Country: {
    type: String,
    required: true,
  },

  AreaOrStreet: {
    type: String,
  },

  Landmark: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Customer", CustomerSchema);
