const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
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

        type: {
            type: String,
            enum: [
                "theory",
                "practical",
                "optional"
            ],
            required: true
        },

        question: {
            type: String,
            required: true
        },

        options: [
            {
                type: String
            }
        ],

        correctAnswer: {
            type: String
        },

        explanation: {
            type: String
        },

        marks: {
            type: Number,
            default: 1
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Question", questionSchema);