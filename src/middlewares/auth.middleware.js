const asyncHandler = require("../helper/asyncHandler");
const ErrorResponse = require("../helper/errorResponse");
const { verifyJwt } = require('../helper/jwt.helper');
const ProducteurUserModel = require("../models/producteur.model");
const RestaurateurUserModel = require("../models/restaurateur.model");

// Helper function to determine the user model based on role
const getUserModel = (role) => {
    return role === 'restaurateur' ? RestaurateurUserModel : ProducteurUserModel;
};

// Middleware to validate user password during login or authentication processes
exports.validatePassword = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;

    try {
        // Get the appropriate user model based on role
        const UserModel = getUserModel(role);

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return next(new ErrorResponse('Invalid email or password', 401));
        }

        // Compare the provided password with the user's stored password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid email or password', 401));
        }

        // If valid, attach user to request object and move to the next middleware
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse('Error during password validation', 500));
    }
});

// Middleware to protect routes by requiring a valid JWT token
exports.protectWithToken = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify the token
        const decoded = verifyJwt(token);

        // Get the appropriate user model based on role
        const UserModel = getUserModel(decoded.role);

        // Find the user by ID
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return next(new ErrorResponse('No user found with this ID', 404));
        }

        // Attach user to request object and move to the next middleware
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Middleware to check token and return user data
exports.verifyAndGetUser = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return next(new ErrorResponse('No token provided', 401));
    }

    try {
        // Verify the token
        const decoded = verifyJwt(token);

        // Get the appropriate user model based on role
        const UserModel = getUserModel(decoded.role);

        // Find the user by ID
        const user = await UserModel.findById(decoded.id).select('-password');
        if (!user) {
            return next(new ErrorResponse('No user found with this ID', 404));
        }

        // Attach user to request object and return user data
        req.user = user;
        res.status(200).json({
            success: true,
            data: omit(user.toObject(), 'password')
        });
    } catch (error) {
        return next(new ErrorResponse('Error verifying token', 401));
    }
});

// Extract token from cookies, Authorization header, or provided token string
function extractToken(req) {
    let token = null;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check cookies
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    return token;
}

// Get user based on verified token
async function getUserFromToken(req) {
    const token = extractToken(req);

    if (!token) {
        throw new ErrorResponse('No token provided', 401);
    }

    const decoded = verifyJwt(token);
    const UserModel = getUserModel(decoded.role);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
        throw new ErrorResponse('No user found with this ID', 404);
    }

    return user;
}
