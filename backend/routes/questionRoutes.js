const express = require("express");

const {
    getPracticeQuestions
} = require("../controllers/questionController");

const {
    authMiddleware
} = require("../middleware/authMiddleware");

const router = express.Router();

// Any logged-in user (intern, faculty, admin) can view a level's questions.
// Used by interns for practice - answers are included in the response.
router.get(
    "/:courseId/:level",
    authMiddleware,
    getPracticeQuestions
);

module.exports = router;