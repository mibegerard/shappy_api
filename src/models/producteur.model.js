const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const producteurUserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        commune: { type: String, required: true },
        telephone: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, required: true, enum: ["producteur"], default: "producteur" },
        password: { type: String, required: true },
        products: { type: [String], required: true },  // Changed to an array of strings
    },
    {
        timestamps: true,
    }
);

producteurUserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const saltIt = parseInt(process.env.PASSWORD_SALT);
    const salt = await bcrypt.genSalt(saltIt);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

producteurUserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password).catch(() => false);
};

const ProducteurUserModel = mongoose.model("Producteur", producteurUserSchema);

module.exports = ProducteurUserModel;
