const express = require("express");

const {
    submitInterview
} = require("../controllers/interviewController");

const {
    authMiddleware
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/submit",
    authMiddleware,
    submitInterview
);

module.exports = router;