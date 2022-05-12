const mongoose = require("mongoose");

const TemporaryShopSchema = new mongoose.Schema(
    {
        fullNameDirector: { type: String, required: true },
        shopName: { type: String, required: true, trim: true},
        shopId: { type: String, required: true},
        address: { type: String, required: true },
        phone: { type: String, required: true},
        bankName: { type: String, required: true },
        mfo: { type: String, required: true},
        inn: { type: String, required: true},
        email: { type: String, required: true},
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "Client",
            required: true,
            index: true
        },
        code: { type: String},
    },
    { timestamps: true }
);
module.exports = mongoose.model("TemporaryShop", TemporaryShopSchema);
