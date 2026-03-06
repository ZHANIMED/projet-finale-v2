const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                title: String,
                price: Number,
                qty: Number,
                image: String,
            },
        ],
        total: { type: Number, required: true },
        status: { type: String, default: "Validée" },
        shippingAddress: { type: String },
        phone: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
