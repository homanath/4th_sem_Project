const express = require("express");
const {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// Notification Routes
router.post("/", createNotification); // Create a notification
router.get("/", getNotifications); // Get all notifications
router.get("/:id", getNotificationById); // Get a notification by ID
router.put("/:id", updateNotification); // Update a notification by ID
router.delete("/:id", deleteNotification); // Delete a notification by ID

module.exports = router;
