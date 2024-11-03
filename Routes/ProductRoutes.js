// routes/productRoutes.js
const express = require("express");
const { createProduct,searchProductsByName,getProductDetailsByName,getAllProductsByCompany } = require("../Controller/ProductController");
const authMiddleware = require("../middleware/CompanyAuth");

const router = express.Router();

// Create product
router.post("/create", authMiddleware, createProduct);

// Search products by name substring
router.post("/search", searchProductsByName);

// Get product details by exact product name
router.get("/:productName/details", getProductDetailsByName);

// Get all products for the authenticated company
router.get("/company/products",authMiddleware, getAllProductsByCompany);

module.exports = router;
