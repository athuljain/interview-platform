const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        intern: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        level: {
            type: String,
            enum: [
                "beginner",
                "intermediate",
                "advanced"
            ],
            required: true
        },

        answers: [
            {
                question: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question"
                },

                answer: {
                    type: String
                },

                isCorrect: {
                    type: Boolean
                },

                marks: {
                    type: Number
                }
            }
        ],

        totalQuestions: {
            type: Number
        },

        correctAnswers: {
            type: Number
        },

        score: {
            type: Number
        },

        percentage: {
            type: Number
        },

        status: {
            type: String,
            enum: [
                "started",
                "completed"
            ],
            default: "started"
        },

        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Interview", interviewSchema);