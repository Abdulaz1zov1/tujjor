const mongoose = require("mongoose");
const InfoSchema = new mongoose.Schema(
    {
        title: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
        },
        description: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
        },
        status: { type: Boolean, required: true, default: true },
        slug: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Info", InfoSchema);
