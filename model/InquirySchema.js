// models/Inquiry.js

const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', // Assuming a separate Company model exists
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Assuming a separate Customer model exists
    required: true
  },
  name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
