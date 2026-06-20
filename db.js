// Path: backend/config/db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are recommended to avoid deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and exit the process
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a non-zero code to indicate an error
  }
};

module.exports = connectDB; // Export the connectDB function
