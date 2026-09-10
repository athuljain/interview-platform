const Question = require("../models/Question");
const Course = require("../models/Course");

// Session structure rules: each course + level combination is one "session"
const SESSION_LIMITS = {
    mcq: 20,
    twomark: 10,
    practical: 5
};

const DEFAULT_MARKS = {
    mcq: 1,
    twomark: 2,
    practical: 5
};


// Add a question to a course + level session
const addQuestion = async (req, res) => {

    try {

        const {
            course,
            level,
            type,
            questionText,
            options,
            answer,
            marks
        } = req.body;

        if (!course || !level || !type || !questionText || !answer) {

            return res.status(400).json({
                message: "course, level, type, questionText and answer are required"
            });

        }

        if (!["beginner", "intermediate", "advanced"].includes(level)) {

            return res.status(400).json({
                message: "level must be beginner, intermediate or advanced"
            });

        }

        if (!["mcq", "twomark", "practical"].includes(type)) {

            return res.status(400).json({
                message: "type must be mcq, twomark or practical"
            });

        }

        const courseExists = await Course.findById(course);

        if (!courseExists) {

            return res.status(404).json({
                message: "Course not found"
            });

        }

        if (type === "mcq") {

            if (!Array.isArray(options) || options.length < 2) {

                return res.status(400).json({
                    message: "mcq questions need at least 2 options"
                });

            }

            if (!options.includes(answer)) {

                return res.status(400).json({
                    message: "answer must match one of the provided options"
                });

            }

        }

        // Enforce the fixed session structure: 20 mcq, 10 twomark, 5 practical
        const existingCount =
            await Question.countDocuments({
                course,
                level,
                type
            });

        if (existingCount >= SESSION_LIMITS[type]) {

            return res.status(400).json({
                message:
                    `This session already has the maximum of ${SESSION_LIMITS[type]} ${type} questions`
            });

        }

        const question = await Question.create({

            course,
            level,
            type,

            questionText,

            options: type === "mcq" ? options : [],

            answer,

            marks: marks || DEFAULT_MARKS[type],

            createdBy: req.user.id

        });

        res.status(201).json({

            message: "Question added successfully",

            question

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Get all questions for a course + level (faculty view, includes answers for editing)
const getQuestions = async (req, res) => {

    try {

        const {
            courseId,
            level
        } = req.params;

        const questions =
            await Question.find({
                course: courseId,
                level
            }).sort({ type: 1, createdAt: 1 });

        res.json(questions);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Edit a question
const updateQuestion = async (req, res) => {

    try {

        const {
            questionText,
            options,
            answer,
            marks
        } = req.body;

        const question =
            await Question.findById(req.params.id);

        if (!question) {

            return res.status(404).json({
                message: "Question not found"
            });

        }

        if (question.type === "mcq" && options && !options.includes(answer || question.answer)) {

            return res.status(400).json({
                message: "answer must match one of the provided options"
            });

        }

        const updated =
            await Question.findByIdAndUpdate(
                req.params.id,
                {
                    ...(questionText && { questionText }),
                    ...(options && { options }),
                    ...(answer && { answer }),
                    ...(marks && { marks })
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        res.json({

            message: "Question updated successfully",

            question: updated

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Delete a question
const deleteQuestion = async (req, res) => {

    try {

        const question =
            await Question.findByIdAndDelete(req.params.id);

        if (!question) {

            return res.status(404).json({
                message: "Question not found"
            });

        }

        res.json({
            message: "Question deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Progress summary for a course + level session, e.g. "12/20 mcq added"
const getSessionSummary = async (req, res) => {

    try {

        const {
            courseId,
            level
        } = req.params;

        const counts = {
            mcq: 0,
            twomark: 0,
            practical: 0
        };

        const results =
            await Question.aggregate([
                {
                    $match: {
                        course:
                            new (require("mongoose").Types.ObjectId)(courseId),
                        level
                    }
                },
                {
                    $group: {
                        _id: "$type",
                        count: { $sum: 1 }
                    }
                }
            ]);

        results.forEach((r) => {
            counts[r._id] = r.count;
        });

        res.json({

            level,

            mcq: { added: counts.mcq, required: SESSION_LIMITS.mcq },
            twomark: { added: counts.twomark, required: SESSION_LIMITS.twomark },
            practical: { added: counts.practical, required: SESSION_LIMITS.practical },

            isComplete:
                counts.mcq >= SESSION_LIMITS.mcq &&
                counts.twomark >= SESSION_LIMITS.twomark &&
                counts.practical >= SESSION_LIMITS.practical

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


module.exports = {
    addQuestion,
    getQuestions,
    updateQuestion,
    deleteQuestion,
    getSessionSummary
};