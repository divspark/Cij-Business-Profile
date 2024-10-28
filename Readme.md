# Connect India Japan API Documentation

## Overview
This document provides an overview of the API endpoints for managing Customers and Companies, along with instructions on how to set up and start the project.

## Project Structure
```
/Business_Profile_Backend_New
│
├── /config              # Configuration files
│   └── db.js           # Database connection setup
│
├── /controller          # Controllers for handling requests
│   ├── CustomerController.js
│   └── CompanyController.js
│
├── /middleware          # Middleware functions
│   └── auth.js         # Authentication middleware
│
├── /model               # Mongoose models
│   ├── CustomerSchema.js
│   └── CompanySchema.js
│
├── /routes              # API route definitions
│   ├── customerRoutes.js
│   └── companyRoutes.js
│
├── /utils               # Utility functions
│   └── sendEmail.js     # Email sending functionality
│
├── .env                 # Environment variables
├── server.js            # Main server file
└── package.json         # Project dependencies and scripts
```

## How to Start the Project
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Business_Profile_Backend_New
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory and add your environment variables (see below).**

4. **Start the server:**
   ```bash
   npm start
   ```

## Environment Variables
Ensure you set the following environment variables in your `.env` file:
```plaintext
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
EMAIL_USER=<your_email@gmail.com>
EMAIL_PASS=<your_email_password_or_app_specific_password>
```

## API Endpoints

## Customer APIs

### 1. Create Customer
- **Endpoint:** `POST /customer/create`
- **Request Body:**
  ```json
  {
    "Name": "John Doe",
    "MobileNumber": "1234567890",
    "Email": "john.doe@example.com",
    "Pincode": "123456",
    "District": "Example District",
    "Country": "Country Name",
    "AreaOrStreet": "Example Street",
    "Landmark": "Near Park",
    "password": "SecurePassword123"
  }
  ```

---

### 2. Customer Login
- **Endpoint:** `POST /customer/login`
- **Request Body:**
  ```json
  {
    "Email": "john.doe@example.com",
    "password": "SecurePassword123"
  }
  ```

- **Response:**
  - On success:
    ```json
    {
      "success": true,
      "message": "Login successful.",
      "token": "your_jwt_token"
    }
    ```
  - On failure:
    ```json
    {
      "success": false,
      "message": "Invalid email or password."
    }
    ```

---

### 3. Get Customer Profile
- **Endpoint:** `GET /customer/profile`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Response:**
  ```json
  {
    "success": true,
    "customer": {
      "Name": "John Doe",
      "MobileNumber": "1234567890",
      "Email": "john.doe@example.com",
      "Pincode": "123456",
      "District": "Example District",
      "Country": "Country Name",
      "AreaOrStreet": "Example Street",
      "Landmark": "Near Park"
    }
  }
  ```

---

### 4. Update Customer Profile
- **Endpoint:** `PUT /customer/update`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Request Body:**
  ```json
  {
    "MobileNumber": "0987654321",
    "AreaOrStreet": "New Street",
    "Landmark": "Near Mall"
  }
  ```

- **Response:**
  ```json
  {
    "success": true,
    "message": "Customer profile updated successfully."
  }
  ```

---

## Company APIs

### 1. Create Company
- **Endpoint:** `POST /company/create`
- **Request Body:**
  ```json
  {
    "CompanyName": "Example Corp",
    "ContactPersonName": "John Doe",
    "PrimaryMobileNumber": "1234567890",
    "PrimaryEmail": "werotif315@regishub.com",
    "Pincode": "123456",
    "District": "Example District",
    "Country": "Country Name",
    "City": "Example City",
    "State": "Example State",
    "BuildingNumberOrFloor": "1st Floor",
    "GSTIN": "GST123456789",
    "PrimaryBusinessType": "Service",
    "CEOName": "Jane Doe",
    "GSTRegistrationDate": "2022-01-01",
    "OwnershipType": "Private Limited",
    "password": "Ravi@123456"
  }
  ```

---

### 2. Company Login
- **Endpoint:** `POST /company/login`
- **Request Body:**
  ```json
  {
    "PrimaryEmail": "werotif315@regishub.com",
    "password": "Ravi@123456"
  }
  ```

- **Response:**
  - On success:
    ```json
    {
      "success": true,
      "message": "Login successful.",
      "token": "your_jwt_token"
    }
    ```
  - On failure:
    ```json
    {
      "success": false,
      "message": "Invalid email or password."
    }
    ```

---

### 3. Get Company Profile
- **Endpoint:** `GET /company/profile`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Response:**
  ```json
  {
    "success": true,
    "company": {
      "CompanyName": "Example Corp",
      "ContactPersonName": "John Doe",
      "PrimaryMobileNumber": "1234567890",
      "PrimaryEmail": "werotif315@regishub.com",
      "Pincode": "123456",
      "District": "Example District",
      "Country": "Country Name",
      "City": "Example City",
      "State": "Example State",
      "BuildingNumberOrFloor": "1st Floor",
      "GSTIN": "GST123456789",
      "PrimaryBusinessType": "Service",
      "CEOName": "Jane Doe",
      "GSTRegistrationDate": "2022-01-01",
      "OwnershipType": "Private Limited"
    }
  }
  ```

---

### 4. Update Company Profile
- **Endpoint:** `PUT /company/update`
- **Headers:**
  ```
  Authorization: Bearer your_jwt_token
  ```

- **Request Body:**
  ```json
  {
    "ContactPersonName": "Jane Smith",
    "PrimaryMobileNumber": "0987654321"
  }
  ```

- **Response:**
  ```json
  {
    "success": true,
    "message": "Company profile updated successfully."
  }
  ```

---

## Conclusion
This documentation provides the necessary information to interact with the Customer and Company APIs. Ensure you have set the appropriate environment variables and include the authorization token in the headers for protected endpoints.
```
