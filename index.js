const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const CompanyRoutes = require("./Routes/CompanyRoutes");
const CustomerRoutes = require("./Routes/CustomerRoutes");
const ProductRoutes = require("./Routes/ProductRoutes");

// Load environment variables from .env file
dotenv.config();

const app = express();

const frontend_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: frontend_URL, // Your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true, // Allow credentials (cookies, headers)
  })
);
// Middleware
app.use(bodyParser.json());
// Use cookie-parser middleware
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((err) => {
    console.log(`Some error occured while connecting to database: ${err}`);
  });

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Routes
app.use("/api/company", CompanyRoutes);
app.use("/api/customer", CustomerRoutes);
app.use("/api/product", ProductRoutes);

// Server listening
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
