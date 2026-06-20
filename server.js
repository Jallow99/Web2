// Path: backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// Enable CORS for all routes - important for frontend-backend communication
app.use(cors());
// Parse JSON bodies for incoming requests
app.use(express.json());

// Routes
// Authentication routes (register, login)
app.use("/api/auth", authRoutes);
// Task management routes (CRUD operations for tasks)
app.use("/api/tasks", taskRoutes);

// Simple root route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Define the port to run the server on, defaulting to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
