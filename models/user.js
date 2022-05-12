const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
    {
        phone: { type: String, unique: true, required: true, trim: true },
        password: { type: String},
        name: { type: String, trim: true },
        isPhoneVerification: {type: Boolean, required: true, default: false},
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
        image: { type: String },
        code: { type: String},
        role: {
            type: String,
            required: true,
            default: "client",
            enum: ["admin", "seller", "client"],
        },
    },
    { timestamps: true }
);
// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model("User", UserSchema);
