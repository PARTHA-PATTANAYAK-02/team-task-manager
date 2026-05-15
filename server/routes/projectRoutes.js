const express = require("express");

const {
  createProject,
  getProjects,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create Project
router.post("/", protect, createProject);

// Get All Projects
router.get("/", protect, getProjects);

module.exports = router;
