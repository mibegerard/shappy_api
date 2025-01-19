const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const restaurateurUserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, required: true, enum: ["restaurateur"], default: "restaurateur" },
        password: { type: String, required: true },
        restaurantName: { type: String, required: true },
        restaurantAddress: { type: String, required: true },
        profilePicture: { type: String, default: ''},
        description: {type: String, default: '' },
        isVerified: { type: Boolean, default: false },
        emailVerificationToken: { type: String, default: null },
        tokenExpiry: { type: Date, default: null }, // Added token expiry field
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to hash password
restaurateurUserSchema.pre("save", async function (next) {
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

// Method to compare password
restaurateurUserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error("Error comparing password:", error);
        return false;
    }
};

// Method to generate email verification token
restaurateurUserSchema.methods.generateVerificationToken = function () {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    this.tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // Token expiry set to 24 hours
    return verificationToken;
};

// Method to verify email
restaurateurUserSchema.methods.verifyEmail = function (token) {
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

const RestaurateurUserModel = mongoose.model("Restaurateur", restaurateurUserSchema);

module.exports = RestaurateurUserModel;
