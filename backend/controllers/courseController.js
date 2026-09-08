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

module.exports = {
    createCourse,
    getCourses
};