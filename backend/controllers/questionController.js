const Question = require("../models/Question");

const createQuestion = async (req, res) => {

    try {

        const question =
            await Question.create({

                ...req.body,

                createdBy: req.user.id

            });

        res.status(201).json(question);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const getInterviewQuestions = async (req, res) => {

    try {

        const {
            courseId,
            level
        } = req.query;

        const questions =
            await Question.find({

                course: courseId,

                level

            }).select(
                "-correctAnswer -explanation"
            );

        res.json(questions);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    createQuestion,
    getInterviewQuestions
};