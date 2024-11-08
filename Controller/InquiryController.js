// controllers/inquiryController.js

const Inquiry = require('../model/InquirySchema');

// Send an inquiry (for customers)
const sendInquiry = async (req, res) => {
    try {
      const { companyId, name, Email, message } = req.body;
      const customerId = req.customer.id; // Assuming customer ID is extracted from JWT
    if (!customerId) {
      return res.status(400).json({ error: 'Customer not authenticated or missing customer ID' });
    }
  
      const newInquiry = new Inquiry({
        companyId,
        customerId,
        name,
        Email,
        message
      });
  
      await newInquiry.save();
      res.status(201).json({ message: 'Inquiry sent successfully' });
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error sending inquiry:", error);
  
      // Send the error message in the response
      res.status(500).json({ error: error.message || 'Error sending inquiry' });
    }
  };
  

// View inquiries (for companies)
const viewAllInquiries = async (req, res) => {
  try {
    const companyId = req.company.id; // Extract company ID from JWT payload

    const inquiries = await Inquiry.find({ companyId });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving inquiries' });
  }
};


// View inquiries sent by the customer
const viewCustomerInquiries = async (req, res) => {
    try {
      const customerId = req.customer.id; // Extract customer ID from JWT payload
  
      const inquiries = await Inquiry.find({ customerId });
      res.status(200).json(inquiries);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving inquiries' });
    }
  };


module.exports = {
  sendInquiry,
  viewAllInquiries,
  viewCustomerInquiries
};