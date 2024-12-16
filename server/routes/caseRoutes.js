const express = require("express");
const {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
} = require("../controllers/caseController");

const router = express.Router();

// Case Routes
router.post("/", createCase); // Create a case
router.get("/", getCases); // Get all cases
router.get("/:id", getCaseById); // Get a case by ID
router.put("/:id", updateCase); // Update a case by ID
router.delete("/:id", deleteCase); // Delete a case by ID

module.exports = router;
