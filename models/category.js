const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
    {
        name: {
            uz: {
                type: String,
                required: true,
                trim: true,
                index: true,
            },
            ru: {
                type: String,
                required: true,
                trim: true,
                index: true,
            },
        },
        parentId: { type: String },
        slug: { type: String, index: true, required: true },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Category", CategorySchema);
