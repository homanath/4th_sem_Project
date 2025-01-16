const express = require("express");
const {
  createNotification,
  getNotifications,
  markAsRead
} = require("../controllers/notificationController");
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

const router = express.Router();

router.use(auth); // Protect all notification routes

router.post("/", roleAuth('lawyer'), createNotification);
router.get("/", getNotifications);
router.put("/:id/read", markAsRead);

module.exports = router;
