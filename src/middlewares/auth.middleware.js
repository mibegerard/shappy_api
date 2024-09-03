const asyncHandler = require("../helper/asyncHandler");
const ErrorResponse = require("../helper/errorResponse");
const { verifyJwt } = require('../helper/jwt.helper');
const ProducteurUserModel = require("../models/producteur.model");
const RestaurateurUserModel = require("../models/restaurateur.model");

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


/*******************************************
 * @type {function(*=, *=, *=): Promise<*>}
 *******************************************/
//protect routes
exports.protectWithToken = asyncHandler(async (req, res, next) => {
    let token
    if (req?.cookies?.token) {
        token = req.cookies.token
    } else if (req?.headers?.authorization && req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new ErrorResponse('Non authentifié, vous devez vous authentifier', 401))
    }

    const {expired, verifiedToken} = await verifyJwt(token)

    console.log('Verified Token:', verifiedToken);

    if (verifiedToken) {
        req.user = verifiedToken
        console.log('Authenticated User:', req.user); // Debugging log
        return next()
    }
    console.log('Authenticated User:', req.user); // Debugging log


    if (expired) {
        return next(new ErrorResponse('Le token d\'accès a expiré, veuillez vous reconnecter', 401));
    }

    return next(new ErrorResponse('Le token d\'accès n\'est pas correct, vous devez vous authentifier', 401));
})


//check token and get data
exports.verifyAndGetUser = asyncHandler(async (req, res, next) => {

    const user = await verifyHeaderToken(req, next)

    if (!user) return next(new ErrorResponse("Le token d'accès n'est pas correct, vous devez vous authentifier", 401))

    res.status(200).send({
        success: false,
        data: user
    })
})

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
