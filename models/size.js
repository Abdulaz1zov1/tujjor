const mongoose = require("mongoose");
const SizeSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
        index: true,
    },
    paramId: {
        type: mongoose.Schema.ObjectId,
        ref: "Param",
        required: true,
        index: true,
    },
    size: { type: String, index: true, required: true},
    price: { type: Number, index: true, required: true},
    count: { type: Number, index: true, required: true},
    discount: Number ,
    discount_percent: Number,
    discount_start: Date,
    discount_end: Date,
});
module.exports = mongoose.model("Size", SizeSchema);
