const mongoose = require("mongoose");
const HelpSchema = new mongoose.Schema(
    {
        title: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
        },
        status: { type: Boolean, required: true, default: true },
        description: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
        },
        slug: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Help", HelpSchema);
