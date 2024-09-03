// models/product.model.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        image: { type: String, required: true },  // New field for image URL or path
        producteur: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Producteur", 
            required: true 
        },
    },
    {
        timestamps: true,
    }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
