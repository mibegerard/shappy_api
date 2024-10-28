const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


const producteurUserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        commune: { type: String, required: true },
        postalCode: { type: String, required: true },
        telephone: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, required: true, enum: ["producteur"], default: "producteur" },
        password: { type: String, required: true },
        emailVerificationToken: { type: String, default: null },
        tokenExpiry: { type: Date, default: null },
        isVerified: { type: Boolean, default: false }

    },
    {
        timestamps: true,
    }
);

producteurUserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const saltIt = parseInt(process.env.PASSWORD_SALT, 10);
    if (isNaN(saltIt)) {
        throw new Error("PASSWORD_SALT must be a valid number");
    }
    const salt = await bcrypt.genSalt(saltIt);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

producteurUserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error("Error comparing password:", error);
        return false;
    }
};

// Method to generate email verification token
producteurUserSchema.methods.generateVerificationToken = function () {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    this.tokenExpiry = Date.now() + 24 * 60 * 60 * 1000
    return verificationToken;
};  

// Method to verify email
producteurUserSchema.methods.verifyEmail = function(token) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (hashedToken !== this.emailVerificationToken) {
        throw new Error("Invalid token");
    }
    if (this.tokenExpiry < Date.now()) {
        throw new Error("Token expired");
    }
    this.isVerified = true;
    this.emailVerificationToken = null; // Clear the token after verification
    this.tokenExpiry = null; // Clear expiry after verification
};

const ProducteurUserModel = mongoose.model("Producteur", producteurUserSchema);

module.exports = ProducteurUserModel;