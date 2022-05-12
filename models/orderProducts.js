const mongoose = require("mongoose");
const OrderProductsSchema = new mongoose.Schema(
    {
        status: {
            type: Number,
            enum: [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            default: 11,
        },
        payed: {
            type: Number,
            enum: [0, 1],
            default: 0,
        },
        orderId: {
            type: Number,
            required: true, 
            index: true
        },
        user: {
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
        paramId: {
            type: mongoose.Schema.ObjectId,
            ref: "Param",
            required: true,
            index: true,
        },
        sizeId: {
            type: mongoose.Schema.ObjectId,
            ref: "Size",
            required: true,
            index: true,
        },
        shopId: {
            type: mongoose.Schema.ObjectId,
            ref: "Shop",
            required: true,
            index: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Brand",
            required: true,
            index: true,
        },
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: "Brand",
            required: true,
            index: true,
        },
        name: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
        },
        image: { type: String, required: true },
        paramImage: { type: String, required: true },
        size: { type: String, required: true },
        count: { type: Number, required: true },
        amount: { type: Number, required: true },
        payedAmount: {type: Number, required: true},
        account: { type: String, required: true },
        percent: { type: Number, required: true },
        article: { type: String, required: true },
        slug: {type: String, required: true},
        description: {
            uz: { type: String},
            ru: { type: String},
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("OrderProducts", OrderProductsSchema);


