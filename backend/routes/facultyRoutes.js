const express = require("express");

const {
    addQuestion,
    getQuestions,
    updateQuestion,
    deleteQuestion,
    getSessionSummary
} = require("../controllers/facultyController");

const {
    authMiddleware,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

// All faculty routes require a valid token AND faculty role
router.use(authMiddleware, authorize("faculty"));

router.post("/questions", addQuestion);
router.get("/questions/:courseId/:level", getQuestions);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);
router.get("/questions/:courseId/:level/summary", getSessionSummary);

module.exports = router;