const express = require("express");
const {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

const router = express.Router();

// Schedule Routes
router.post("/", createSchedule); // Create a schedule
router.get("/", getSchedules); // Get all schedules
router.get("/:id", getScheduleById); // Get a schedule by ID
router.put("/:id", updateSchedule); // Update a schedule by ID
router.delete("/:id", deleteSchedule); // Delete a schedule by ID

module.exports = router;
