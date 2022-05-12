const mongoose = require("mongoose");
const BannerSchema = new mongoose.Schema({
    image: {
        uz: {type: String, required: true},
        ru: {type: String, required: true}
    },
    url: {type: String, required: true},
    position: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
});
module.exports = mongoose.model("Banner", BannerSchema);
