const asyncHandler = require("../helper/asyncHandler");
const { jwtSign } = require('../helper/jwt.helper');
const ErrorResponse = require("../helper/errorResponse");
const RestaurateurUserModel = require("../models/restaurateur.model");
const ProducteurUserModel = require("../models/producteur.model");
const { omit } = require("lodash");

/*******************************************************************
 * @desc                Register a new user as restaurateur 
 * @Method              POST
 * @URL                 /api/auth/register/restaurateur
 * @access              Private
 *******************************************************************/
exports.registerAsRestaurateur = asyncHandler(async (req, res, next) => {
    const { 
        email, 
        password, 
        firstName, 
        lastName, 
        city,
        postalCode,
        phoneNumber,
        restaurantName,
        restaurantAddress 
    } = req.body;

    try {
        // Check if the user already exists
        let user = await RestaurateurUserModel.findOne({ email });
        if (user) {
            return next(new ErrorResponse('Email already exists', 400));
        }

        // Create new restaurateur user
        user = new RestaurateurUserModel({
            email,
            password,
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            restaurantName,
            restaurantAddress
        });

        // Save user to the database
        await user.save();

        // Generate JWT token
        const token = jwtSign({ id: user._id, role: 'restaurateur' });

        // Send response with token and user details
        res.status(201).json({
            success: true,
            token,
            user: omit(user.toObject(), ['password']) // Exclude password
        });
    } catch (error) {
        return next(new ErrorResponse('Error registering user', 500));
    }
});

/*******************************************************************
 * @desc                Register a new user as producteur 
 * @Method              POST
 * @URL                 /api/auth/register/producteur
 * @access              Private
 *******************************************************************/
exports.registerAsProducteur = asyncHandler(async (req, res, next) => {
    const { 
        email, 
        password, 
        firstName, 
        lastName, 
        commune,
        postalCode, 
        telephone, 
        products 
    } = req.body;

    try {
        // Check if the user already exists
        let user = await ProducteurUserModel.findOne({ email });
        if (user) {
            return next(new ErrorResponse('Email already exists', 400));
        }

        // Create new producteur user
        user = new ProducteurUserModel({
            email,
            password,
            firstName,
            lastName,
            commune,
            postalCode,
            telephone,
            products
        });

        // Save user to the database shappy
        await user.save();

        // Generate JWT token
        const token = jwtSign({ id: user._id, role: 'producteur' });

        // Send response with token and user details
        res.status(201).json({
            success: true,
            token,
            user: omit(user.toObject(), ['password']) // Exclude password
        });
    } catch (error) {
        return next(new ErrorResponse('Error registering user', 500));
    }
});

/*******************************************************************
 * @desc                Login a user (both restaurateur and producteur)
 * @Method              POST
 * @URL                 /api/auth/login
 * @access              Public
 *******************************************************************/
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return next(new ErrorResponse('Please provide both email and password', 400));
    }

    try {
        // Check if the user exists in both collections
        let user = await RestaurateurUserModel.findOne({ email });
        if (!user) {
            user = await ProducteurUserModel.findOne({ email });
        }

        // Check if user exists and passwords match
        if (!user || !(await user.comparePassword(password))) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Generate JWT token
        const token = jwtSign({ id: user._id, role: user.role });

        // Send response with token and user details
        res.status(200).json({
            success: true,
            token,
            user: omit(user.toObject(), ['password']) // Exclude password
        });
    } catch (error) {
        return next(new ErrorResponse('Error logging in', 500));
    }
});

/*******************************************************************
 * @desc                Log out user and destroy session
 * @Method              POST
 * @URL                 /api/auth/logout
 * @access              Public
 *******************************************************************/
exports.logout = asyncHandler(async (req, res, next) => {
    // Destroy session or remove token on client side
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});
