const mongoose = require("mongoose");
const Comment = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "Client",
        required: true,
        index: true,
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
        index: true,
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true,
    },
});
module.exports = mongoose.model("Comment", Comment);
