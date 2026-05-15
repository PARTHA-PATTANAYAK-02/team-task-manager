const express = require("express");

const {
  createTask,
  getTasks,
  updateTaskStatus,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create Task
router.post("/", protect, createTask);

// Get Tasks
router.get("/", protect, getTasks);

// Update Task Status
router.put("/:id", protect, updateTaskStatus);

module.exports = router;
