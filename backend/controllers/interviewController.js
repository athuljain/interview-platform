const Question = require("../models/Question");
const Interview = require("../models/Interview");

const submitInterview = async (req, res) => {

    try {

        const {
            courseId,
            level,
            answers
        } = req.body;

        let correctAnswers = 0;

        let totalMarks = 0;

        let obtainedMarks = 0;

        const processedAnswers = [];

        for (const item of answers) {

            const question =
                await Question.findById(
                    item.questionId
                );

            if (!question) continue;

            const isCorrect =
                question.correctAnswer ===
                item.answer;

            const marks =
                isCorrect
                    ? question.marks
                    : 0;

            if (isCorrect) {
                correctAnswers++;
            }

            totalMarks += question.marks;

            obtainedMarks += marks;

            processedAnswers.push({

                question: question._id,

                answer: item.answer,

                isCorrect,

                marks

            });

        }

        const percentage =
            totalMarks > 0
                ? (obtainedMarks / totalMarks) * 100
                : 0;

        const interview =
            await Interview.create({

                intern: req.user.id,

                course: courseId,

                level,

                answers: processedAnswers,

                totalQuestions:
                    answers.length,

                correctAnswers,

                score: obtainedMarks,

                percentage:

                    Math.round(
                        percentage
                    ),

                status: "completed",

                completedAt: new Date()

            });

        res.status(201).json({

            message:
                "Interview completed",

            result: interview

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    submitInterview
};