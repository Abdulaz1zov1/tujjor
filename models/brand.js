const mongoose = require("mongoose");
const BrandSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        image: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);
module.exports = mongoose.model("brand", BrandSchema);
