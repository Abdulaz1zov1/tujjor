const mongoose = require("mongoose");

const ApplicationShopSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "Client",
            unique: true,
            required: true,
        },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        companyName: { type: String, required: true },
        comment: { type: String },
        status: { type: Number, enum: [0, 1], default: 0 },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Applicationshop", ApplicationShopSchema);
