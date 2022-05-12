const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "Client",
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            index: true,
            required: true,
        },
        name: String,
        shopCount: {type: Number, required: true},
        dostavka: { type: Number, required: true},
        paySystem: {
            type: String,
        },
        orderId: {
            type: Number,
            unique: true,
            required: true,
        },
        address: {
            region: {
                type: mongoose.Schema.ObjectId,
                ref: "Region",
                required: true,
            },
            district: {
                type: mongoose.Schema.ObjectId,
                ref: "District",
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
            phone: { type: String, required: true },
        },
        payed: {
            type: Number,
            enum: [0, 1],
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", OrderSchema);
