// Path: backend/routes/tasks.js
const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth"); // Import the protect middleware

// All task routes are protected, meaning a valid JWT is required
// Route to get all tasks and create a new task
router.route("/").get(protect, getTasks).post(protect, createTask);

// Route to get a specific task, update a task, and delete a task by ID
router
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
