const express = require("express");

const {
    createQuestion,
    getInterviewQuestions
} = require("../controllers/questionController");

const {
    authMiddleware,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorize("admin", "faculty"),
    createQuestion
);

router.get(
    "/interview",
    authMiddleware,
    getInterviewQuestions
);

module.exports = router;