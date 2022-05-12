const mongoose = require("mongoose");
const PayedList = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
        shop: { type: mongoose.Schema.ObjectId, ref: "Shop", required: true },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: true,
        },
        brand: { type: mongoose.Schema.ObjectId, ref: "Brand", required: true },
        amount: { type: Number, require: true },
        payedAmount: { type: Number, require: true },
        count: { type: Number, require: true },
    },
    { timestamps: true }
);
module.exports = mongoose.model("PayedList", PayedList);
