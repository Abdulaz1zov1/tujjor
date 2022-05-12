const mongoose = require("mongoose");
const ParamSchema = new mongoose.Schema({
    image: { type: String, required: true },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
        index: true,
    },
});
module.exports = mongoose.model("Param", ParamSchema);
