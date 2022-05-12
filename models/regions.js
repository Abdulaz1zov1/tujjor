const mongoose = require("mongoose");

const RegionSchema = new mongoose.Schema(
    {
        name: {
            uz: { type: String, required: true },
            ru: { type: String, reuqired: true },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Region", RegionSchema);
