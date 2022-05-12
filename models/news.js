const mongoose = require("mongoose");
const NewsSchema = new mongoose.Schema(
    {
        title: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
        },
        description: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
        },
        hashtag: { type: String, index: true },
        startTime: { type: Date, required: true },
        file: { type: String, required: true },
        status: { type: Boolean, required: true, default: true },
        slug: { type: String, required: true, unique: true },
        type: { type: String, required: true, enum: ["image", "video"] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
