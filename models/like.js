const mongoose = require("mongoose");
const LikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Client",
        required: true,
        index: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
        index: true,
    },
});
module.exports = mongoose.model("Like", LikeSchema);
