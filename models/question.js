const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        question: { type: String, required: true },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Question", QuestionSchema);
