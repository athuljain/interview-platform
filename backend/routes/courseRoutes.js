const express = require("express");

const {
    createCourse,
    getCourses
} = require("../../controllers/courseController");

const {
    authMiddleware,
    authorize
} = require("../../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorize("admin"),
    createCourse
);

router.get(
    "/",
    authMiddleware,
    getCourses
);

module.exports = router;