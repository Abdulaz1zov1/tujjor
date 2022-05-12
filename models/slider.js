const mongoose = require("mongoose");
const SliderSchema = new mongoose.Schema({
    image: {
        uz: {type: String, required: true},
        ru: {type: String, required: true}
    },
    url: {type: String, required: true},
});
module.exports = mongoose.model("Slider", SliderSchema);
