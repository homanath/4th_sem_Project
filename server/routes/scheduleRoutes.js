const express = require("express");
const scheduleController = require("../controllers/scheduleController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Protect all routes with authentication
router.use(authenticate);

// Schedule routes
router.get("/", scheduleController.getAll);
router.post("/", scheduleController.create);
router.put("/:id", scheduleController.update);
router.delete("/:id", scheduleController.delete);

module.exports = router;
