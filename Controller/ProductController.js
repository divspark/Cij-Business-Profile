const Product = require("../model/ProductSchema");

const createProduct = async (req, res) => {
    try {
      const companyId = req.company.id; // Use company ID from the authenticated company
      const { productName, description, category, price, features, quantity } = req.body;
  
      // Check for required fields
      if (!productName || !category || !price || !quantity) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required product details, including quantity.",
        });
      }
  
      // Check if product already exists for the same company
      const existingProduct = await Product.findOne({ productName, company: companyId });
  
      if (existingProduct) {
        // If product exists, increase its quantity
        existingProduct.quantity += quantity;
        await existingProduct.save();
  
        return res.status(200).json({
          success: true,
          message: "Product quantity updated successfully.",
          product: existingProduct,
        });
      } else {
        // If product doesn't exist, create a new product
        const newProduct = new Product({
          productName,
          description,
          category,
          price,
          features,
          quantity,
          company: companyId, // Associate product with the company
        });
  
        await newProduct.save();
  
        res.status(201).json({
          success: true,
          message: "Product created successfully.",
          product: newProduct,
        });
      }
    } catch (error) {
      console.error("Error creating or updating product:", error);
      res.status(500).json({
        success: false,
        message: "Server error.",
        error: error.message,
      });
    }
  };
  


const searchProductsByName = async (req, res) => {
    try {
      const { nameSubstring } = req.body;
  
      if (!nameSubstring) {
        return res.status(400).json({
          success: false,
          message: "Please provide a substring to search for.",
        });
      }
  
      // Use a case-insensitive regular expression to find products with names containing the substring
      const regex = new RegExp(nameSubstring, "i");
      const products = await Product.find({ productName: regex }).populate("company");
  
      res.status(200).json({
        success: true,
        message: "Products retrieved successfully.",
        products,
      });
    } catch (error) {
      console.error("Error searching for products:", error);
      res.status(500).json({
        success: false,
        message: "Server error.",
        error: error.message,
      });
    }
  };



  const getProductDetailsByName = async (req, res) => {
    try {
      const { productName } = req.params;
  
      if (!productName) {
        return res.status(400).json({
          success: false,
          message: "Please provide a product name.",
        });
      }
  
      // Find the product by its exact name, along with associated company details
      const product = await Product.findOne({ productName }).populate("company");
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Product retrieved successfully.",
        product,
      });
    } catch (error) {
      console.error("Error retrieving product details:", error);
      res.status(500).json({
        success: false,
        message: "Server error.",
        error: error.message,
      });
    }
  };


  const getAllProductsByCompany = async (req, res) => {
    try {
      // Retrieve company ID from the authenticated request (set by authMiddleware)
      const companyId = req.company.id;
  
      // Find all products associated with this company
      const products = await Product.find({ company: companyId });
  
      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No products found for this company.",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Products retrieved successfully.",
        products,
      });
    } catch (error) {
      console.error("Error retrieving products:", error);
      res.status(500).json({
        success: false,
        message: "Server error.",
        error: error.message,
      });
    }
  };
  

module.exports = {
  createProduct,searchProductsByName,getProductDetailsByName,getAllProductsByCompany
};
