const express = require("express");
const scheduleController = require("../controllers/scheduleController");
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

const router = express.Router();

// Protect all routes with authentication
router.use(auth);

// Schedule routes
router.get("/", scheduleController.getSchedules);
router.post("/", roleAuth(["lawyer"]), scheduleController.createSchedule);
router.get("/:id", scheduleController.getScheduleById);
router.put("/:id", roleAuth(["lawyer"]), scheduleController.updateSchedule);
router.delete("/:id", roleAuth(["lawyer"]), scheduleController.deleteSchedule);

module.exports = router;
