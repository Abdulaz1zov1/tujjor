const mongoose = require("mongoose");
const FooterImage = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
        index: true
    },
    image: { type: String, required: true },
});

module.exports = mongoose.model("FooterImage", FooterImage);
