const Question = require("../models/Question");

// Used by interns (and faculty, for preview) to view a level's questions
// with answers included, grouped by type.
const getPracticeQuestions = async (req, res) => {

    try {

        const {
            courseId,
            level
        } = req.params;

        if (!["beginner", "intermediate", "advanced"].includes(level)) {

            return res.status(400).json({
                message: "level must be beginner, intermediate or advanced"
            });

        }

        const questions =
            await Question.find({
                course: courseId,
                level
            }).sort({ createdAt: 1 });

        const grouped = {
            mcq: [],
            twomark: [],
            practical: []
        };

        questions.forEach((q) => {
            grouped[q.type].push(q);
        });

        res.json({

            level,

            totalQuestions: questions.length,

            totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),

            mcq: grouped.mcq,
            twomark: grouped.twomark,
            practical: grouped.practical

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


module.exports = {
    getPracticeQuestions
};