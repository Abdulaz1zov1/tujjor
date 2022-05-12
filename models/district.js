const mongoose = require("mongoose");

const DistrictSchema = new mongoose.Schema(
    {
        name: {
            uz: { type: String, required: true },
            ru: { type: String, reuqired: true },
        },
        region: {
            type: mongoose.Schema.ObjectId,
            ref: "Region",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("District", DistrictSchema);
