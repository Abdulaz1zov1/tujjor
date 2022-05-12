const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const ClientSchema = new mongoose.Schema(
    {
        phone: { type: String, unique: true, required: true, trim: true },
        name: { type: String, trim: true },
        address: {
            region: {
                type: mongoose.Schema.ObjectId,
                ref: "Region",
            },
            district: {
                type: mongoose.Schema.ObjectId,
                ref: "District",
            },
            address: {
                type: String,
            },
        },
        code: { type: String}
    },
    { timestamps: true }
);
// Sign JWT and return
ClientSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model("Client", ClientSchema);
