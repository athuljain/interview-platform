const Course = require("../models/Course");

const createCourse = async (req, res) => {

    try {

        const {
            name,
            description,
            technologies
        } = req.body;

        const course =
            await Course.create({

                name,

                description,

                technologies,

                createdBy: req.user.id

            });

        res.status(201).json(course);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const getCourses = async (req, res) => {

    try {

        const courses =
            await Course.find()
                .populate(
                    "faculty",
                    "name email"
                );

        res.json(courses);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const updateCourse = async (req, res) => {

    try {

        const {
            name,
            description,
            technologies
        } = req.body;

        const course =
            await Course.findByIdAndUpdate(
                req.params.id,
                {
                    ...(name && { name }),
                    ...(description !== undefined && { description }),
                    ...(technologies && { technologies })
                },
                {
                    new: true,
                    runValidators: true
                }
            ).populate("faculty", "name email");

        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }

        res.json({

            message: "Course updated successfully",

            course

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const deleteCourse = async (req, res) => {

    try {

        const course =
            await Course.findByIdAndDelete(req.params.id);

        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }

        res.json({
            message: "Course deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


module.exports = {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse
};