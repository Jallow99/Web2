// Path: backend/controllers/taskController.js
const asyncHandler = require("express-async-handler");
const Task = require("../models/Task"); // Import the Task model

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  // Find all tasks associated with the authenticated user
  const tasks = await Task.find({ user: req.user._id });
  res.status(200).json(tasks);
});

// @desc    Get a single task by ID for the logged-in user
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: "Not authorized to view this task" });
      return;
    }
    res.status(200).json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  // Basic validation: title is required
  if (!title) {
    res.status(400).json({ message: "Please add a title for the task" });
    return;
  }

  // Create the task, associating it with the authenticated user
  const task = await Task.create({
    user: req.user._id, // Assign the task to the current user
    title,
    description,
    status,
    dueDate,
  });

  res.status(201).json(task); // Respond with the newly created task
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  let task = await Task.findById(req.params.id);

  if (task) {
    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: "Not authorized to update this task" });
      return;
    }

    // Update task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save(); // Save the updated task
    res.status(200).json(updatedTask);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: "Not authorized to delete this task" });
      return;
    }

    await Task.deleteOne({ _id: req.params.id }); // Use deleteOne to remove the task
    res.status(200).json({ message: "Task removed" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
