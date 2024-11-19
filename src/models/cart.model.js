const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        restaurateur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurateur", // Reference to the Restaurateur model
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product", // Reference to the Product model
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1, // Ensure quantity is at least 1
                },
                price: {
                    type: Number,
                    required: true,
                },
                totalPrice: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            default: 0, // Initialize with 0, and it will be calculated
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to calculate total price of the cart
cartSchema.pre("save", function (next) {
    this.totalPrice = this.products.reduce((total, item) => {
        item.totalPrice = item.quantity * item.price; // Calculate individual product price
        return total + item.totalPrice; // Sum up total price
    }, 0);
    next();
});

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;
