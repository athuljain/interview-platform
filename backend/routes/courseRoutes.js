const express = require("express");

const {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

const {
    authMiddleware,
    authorize
} = require("../middleware/authMiddleware");

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

router.put(
    "/:id",
    authMiddleware,
    authorize("admin"),
    updateCourse
);

router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    deleteCourse
);

module.exports = router;