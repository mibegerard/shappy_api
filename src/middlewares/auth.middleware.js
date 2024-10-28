const asyncHandler = require("../helper/asyncHandler");
const ErrorResponse = require("../helper/errorResponse");
const { verifyJwt } = require('../helper/jwt.helper');
const { jwtSign } = require('../helper/jwt.helper');
const ProducteurUserModel = require("../models/producteur.model");
const RestaurateurUserModel = require("../models/restaurateur.model");
const crypto = require('crypto');
// Helper function to get the user model based on role
const getUserModel = (role) => {
    switch (role) {
        case 'restaurateur':
            return RestaurateurUserModel;
        case 'producteur':
            return ProducteurUserModel;
        default:
            throw new ErrorResponse('Invalid role', 400);
    }
};

// Helper function to get user model by email
const getUserModelByEmail = async (email) => {
    let userModel = await RestaurateurUserModel.findOne({ email });
    if (userModel) return RestaurateurUserModel;

    userModel = await ProducteurUserModel.findOne({ email });
    if (userModel) return ProducteurUserModel;

    return null;
};

// Middleware to validate user password during login or authentication processes
exports.validatePassword = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Email and password are required', 400));
    }

    try {
        // Get the user model based on email
        const UserModel = await getUserModelByEmail(email);
        if (!UserModel) {
            return next(new ErrorResponse('Invalid email or password', 401));
        }

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

// Middleware to verify email
exports.verifyEmail = asyncHandler(async (req, res, next) => {
    const { token, redirect } = req.query;
    const email = req.body.email || req.query.email;

    console.log("Incoming email:", email);
    console.log("Incoming token (URL):", token);

    if (!email) {
        return next(new ErrorResponse("Email is required", 400));
    }

    if (!token) {
        return next(new ErrorResponse("Token is required", 400));
    }

    // Hash the token sent via email
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Get the user model by email
    const userModel = await getUserModelByEmail(email);
    
    if (!userModel) {
        console.log("User model not found for email:", email);
        return next(new ErrorResponse("Invalid or expired token", 400));
    }

    // Find the user by the hashed token

    const user = await userModel.findOne({ 
        email
    });

    // Debugging logs
    console.log("Incoming token (URL):", token);
    console.log("Hashed token (URL):", hashedToken);
    if (user) {
        console.log("User found for verification:", user.email);
        console.log("Stored token in DB:", user.emailVerificationToken);
        console.log("Token expiry in DB:", user.tokenExpiry);
        console.log("Current time:", Date.now());
    } else {
        console.log("User not found with the provided token.");
        return next(new ErrorResponse("Invalided or expired token", 400));
    }

    // Check if the token has expired
    if (user.tokenExpiry < Date.now()) {
        console.log("Token has expired for user:", user.email);
        return next(new ErrorResponse("Token has expired", 400));
    }

    user.isVerified = true;
    user.emailVerificationToken = null; // Clear the token
    user.tokenExpiry = null; // Clear the token expiry
    await user.save();


    // Dynamically assign the user's role for token creation
    const authToken = jwtSign({ id: user._id, role: user.role });
    console.log("Generated JWT token for user:", user.email);

    // Redirect to home page with token if `redirect` parameter is present
    if (redirect) {
        console.log("Redirecting user to home page with token.");
        return res.redirect(`${process.env.ORIGIN}?token=${authToken}`);
    }

    res.status(200).json({
        success: true,
        message: "Email verified successfully",
        token: authToken,
    });
});

// Middleware to ensure the user is verified
exports.verifyUser = (req, res, next) => {
    const user = req.user; // This should be populated by your authentication middleware

    // Check if user is verified
    if (!user.isVerified) {
        console.log(`User verification failed for user ID: ${user.id}`);
        return next(new ErrorResponse('User is not verified. Please check your email for verification.', 403));
    }

    console.log(`User verification failed for user ID: ${user.id}`);

    next();
};



/*******************************************
 * @type {function(*=, *=, *=): Promise<*>}
 *******************************************/
exports.protectWithToken = asyncHandler(async (req, res, next) => {
    let token;

    // Retrieve token from cookies or authorization header
    if (req?.cookies?.token) {
        token = req.cookies.token;
    } else if (req?.headers?.authorization && req?.headers?.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, return an authentication error
    if (!token) {
        return next(new ErrorResponse('Non authentifié, vous devez vous authentifier', 401));
    }

    // Verify the JWT
    const { expired, verifiedToken } = await verifyJwt(token);

    // Handle expired tokens
    if (expired) {
        return next(new ErrorResponse('Le token d\'accès a expiré, veuillez vous reconnecter', 401));
    }

    // Handle valid tokens
    if (verifiedToken) {
        req.user = verifiedToken;
        console.log('Authenticated User:', req.user); // Optional: Replace with proper logging in production
        return next();
    }

    // If token is invalid, return an error
    return next(new ErrorResponse('Le token d\'accès n\'est pas correct, vous devez vous authentifier', 401));
});

exports.verifyAndGetUser = asyncHandler(async (req, res, next) => {
    const verifiedToken = await verifyHeaderToken(req, next);

    if (!verifiedToken || !verifiedToken.id || !verifiedToken.role) {
        return next(new ErrorResponse("Le token d'accès n'est pas correct, vous devez vous authentifier", 401));
    }

    // Step 2: Identify the user model based on the role
    const UserModel = getUserModel(verifiedToken.role);
    
    try {
        // Step 3: Fetch the user from the database by ID, excluding password
        const user = await UserModel.findById(verifiedToken.id).select('-password');

        if (!user) {
            return next(new ErrorResponse("Utilisateur non trouvé", 404));
        }

        // Step 4: Prepare user data for the response
        const userData = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isVerified: user.isVerified,
            role: verifiedToken.role,
        };

        // Step 5: Respond with the user data
        res.status(200).json({
            success: true,
            data: userData,
        });
    } catch (error) {
        console.error("Error retrieving user data:", error);
        return next(new ErrorResponse("Une erreur s'est produite lors de la récupération des données utilisateur", 500));
    }
});

async function verifyHeaderToken(req, next, paramToken = null) {
    let token
    if (req?.cookies?.token && paramToken === null) {
        token = req.cookies.token
    } else if (req?.headers?.authorization && req?.headers?.authorization?.startsWith('Bearer') && paramToken === null) {
        token = req.headers.authorization.split(' ')[1]
    } else if (paramToken) {
        token = paramToken
    }

    if (!token) {
        return next(new ErrorResponse('Non authentifié, vous devez vous authentifier', 401))
    }

    const {expired, verifiedToken} = await verifyJwt(token)
    return verifiedToken
}

// Middleware to ensure the user is a producteur
exports.ensureProducteurRole = (req, res, next) => {
    if (req.user.role !== 'producteur') {
        return next(new ErrorResponse('Unauthorized access', 403));
    }
    next();
};

