const express = require("express");
const caseController = require("../controllers/caseController");
const auth = require("../middleware/auth");
const lawyerAuth = require("../middleware/lawyerAuth");

const router = express.Router();

// Protect all routes with authentication
router.use(auth);

// Case routes
router.post("/", lawyerAuth, caseController.createCase);
router.get("/", caseController.getCases);
router.get("/:id", caseController.getCaseById);
router.put("/:id", lawyerAuth, caseController.updateCase);
router.delete("/:id", lawyerAuth, caseController.deleteCase);

module.exports = router;
