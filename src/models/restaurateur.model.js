const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    },
    {
        timestamps: true,
    }
);

restaurateurUserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const saltIt = parseInt(process.env.PASSWORD_SALT);
    const salt = await bcrypt.genSalt(saltIt);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

restaurateurUserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password).catch(() => false);
};

const RestaurateurUserModel = mongoose.model("Restaurateur", restaurateurUserSchema);

module.exports = RestaurateurUserModel;
