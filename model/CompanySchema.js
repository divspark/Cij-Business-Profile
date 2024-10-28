const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CompanySchema = new mongoose.Schema({
  CompanyName: {
    type: String,
    required: true,
  },

  ContactPersonName: {
    type: String,
    required: true,
  },

  PrimaryMobileNumber: {
    type: String,
    required: true,
  },

  PrimaryEmail: {
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

  GoogleBusinessURL: {
    type: String,
  },

  InstagramBusinessURL: {
    type: String,
  },

  Designation: {
    type: String,
  },

  AlternateMobileNumber: {
    type: String,
  },

  AlternateEmail: {
    type: String,
  },

  City: {
    type: String,
    required: true,
  },

  State: {
    type: String,
    required: true,
  },

  BuildingNumberOrFloor: {
    type: String,
    required: true,
  },

  Locality: {
    type: String,
  },

  WebsiteURL: {
    type: String,
  },

  FacebookBusinessURL: {
    type: String,
  },

  GSTIN: {
    type: String,
    required: true,
  },
  PrimaryBusinessType: {
    type: String,
    required: true,
  },
  CEOName: {
    type: String,
    required: true,
  },
  GSTRegistrationDate: {
    type: String,
    required: true,
  },
  SecondaryBusiness: {
    type: String,
  },
  NumberOfEmployees: {
    type: String,
  },

  OwnershipType: {
    type: String,
    required: true,
  },

  AnnualTurnover: {
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
CompanySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Company", CompanySchema);
