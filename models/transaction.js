const mongoose = require("mongoose");

const Transaction = new mongoose.Schema({
    tid: { type: String },
    time: { type: Number },
    state: { type: Number },
    create_time: { type: Number },
    perform_time: { type: Number },
    cancel_time: { type: Number },
    amount: { type: Number },
    transaction: { type: String, required: true, unique: true },
    order: { type: Number },
    reason: { type: Number },
    receivers: [
        {
            id: { type: String, required: true },
            amount: { type: Number, required: true },
        },
    ],
});

module.exports = mongoose.model("Transaction", Transaction);
