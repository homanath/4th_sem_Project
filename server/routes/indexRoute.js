const express = require("express");
const userRoutes = require("./userRoutes");
const notificationRoutes = require("./notificationRoutes");
const scheduleRoutes = require("./scheduleRoutes");
const caseRoutes = require("./caseRoutes");

const router = express.Router();

// Mount routes
router.use("/users", userRoutes); // User routes
router.use("/notifications", notificationRoutes); // Notification routes
router.use("/schedules", scheduleRoutes); // Schedule routes
router.use("/cases", caseRoutes); // Case routes

module.exports = router;
