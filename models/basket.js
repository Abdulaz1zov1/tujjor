const mongoose = require("mongoose");
const BasketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Client",
        required: true,
        index: true,
    },
    param: {
        type: mongoose.Schema.ObjectId,
        ref: "Param",
        required: true,
        index: true,
    },
    size: {
        type: mongoose.Schema.ObjectId,
        ref: "Size",
        required: true,
        index: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
        index: true,
    },
    count: { type: Number, required: true, index: true },
});
module.exports = mongoose.model("Basket", BasketSchema);
