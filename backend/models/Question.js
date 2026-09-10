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
            enum: ["beginner", "intermediate", "advanced"],
            required: true
        },

        type: {
            type: String,
            enum: ["mcq", "twomark", "practical"],
            required: true
        },

        questionText: {
            type: String,
            required: true,
            trim: true
        },

        // Only used when type === "mcq"
        options: [
            {
                type: String
            }
        ],

        // For mcq: the correct option text (must match one of "options")
        // For twomark / practical: the answer / answer snippet shown to interns
        answer: {
            type: String,
            required: true
        },

        marks: {
            type: Number,
            required: true
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