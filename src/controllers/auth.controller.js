const asyncHandler = require("../helper/asyncHandler");
const { jwtSign, verifyJwt } = require('../helper/jwt.helper');
const ErrorResponse = require("../helper/errorResponse");
const RestaurateurUserModel = require("../models/restaurateur.model");
const ProducteurUserModel = require("../models/producteur.model");
const { omit } = require("lodash");
const sendEmail = require("../helper/sendEmail"); 

const getUserById = async (userId) => {
    let user = await RestaurateurUserModel.findById(userId);
    if (!user) {
        user = await ProducteurUserModel.findById(userId);
    }
    if (!user) {
        console.warn('No user found with ID:', userId);
    }
    return user;
};


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
        let existingUser = await RestaurateurUserModel.findOne({ email }) || await ProducteurUserModel.findOne({ email });
        if (existingUser) {
            return next(new ErrorResponse('Email already exists', 400));
        }

        // Create new restaurateur user
        const user = new RestaurateurUserModel({
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

        // Generate email verification token and URL
        const verificationToken = user.generateVerificationToken();
        const verificationUrl = `${req.protocol}://${req.get("host")}/api/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}&redirect=true`;
        
        // Log the verification URL to the console
        console.log('Verification URL:', verificationUrl);
        const options = {
            email: user.email,
            subject: 'Vérification de l\'email',
            message: `Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email : \n\n ${verificationUrl}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
                    <h2 style="color: #333;">Bienvenue sur Shappy !</h2>
                    <p style="color: #555;">Merci de vous être inscrit. Pour finaliser votre inscription, veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
                    <p style="margin: 20px 0;">
                        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Vérifier l'email</a>
                    </p>
                    <p style="color: #555;">Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
                    <p style="color: #999;">Cordialement,<br/>L'équipe Shappy</p>
                </div>
            `,
        };

        // Send verification email
        try {
            await sendEmail(options);

            await user.save();

            // Generate JWT token after successful registration
            const token = jwtSign({ id: user._id, role: 'restaurateur' });

            // Send response with token and user details
            console.log('Newly registered user:', user);
            console.log('Generated JWT token:', token);

            // Send response with token and user details
            res.status(201).json({
                success: true,
                token,
                user: omit(user.toObject(), ['password']) // Exclude password
            });
        } catch (error) {
            return next(new ErrorResponse("Email could not be sent", 500));
        }

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
        let existingUser = await RestaurateurUserModel.findOne({ email }) || await ProducteurUserModel.findOne({ email });
        if (existingUser) {
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

        // Generate email verification token and URL
        const verificationToken = user.generateVerificationToken();
        const verificationUrl = `${req.protocol}://${req.get("host")}/api/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}&redirect=true`;
        
        // Log the verification URL to the console
        console.log('Verification URL:', verificationUrl);
        const options = {
            email: user.email,
            subject: 'Vérification de l\'email',
            message: `Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email : \n\n ${verificationUrl}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
                    <h2 style="color: #333;">Bienvenue sur Shappy !</h2>
                    <p style="color: #555;">Merci de vous être inscrit. Pour finaliser votre inscription, veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
                    <p style="margin: 20px 0;">
                        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Vérifier l'email</a>
                    </p>
                    <p style="color: #555;">Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
                    <p style="color: #999;">Cordialement,<br/>L'équipe Shappy</p>
                </div>
            `,
        };

        // Send verification email
        try {
            await sendEmail(options);

            await user.save();

            // Generate JWT token after successful registration
            const token = jwtSign({ id: user._id, role: 'producteur' });

            // Send response with token and user details
            console.log('Newly registered user:', user);
            console.log('Generated JWT token:', token);

            // Send response with token and user details
            res.status(201).json({
                success: true,
                token,
                user: omit(user.toObject(), ['password']) // Exclude password
            });
        } catch (error) {
            return next(new ErrorResponse("Email could not be sent", 500));
        }

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
    const { email, password, token } = req.body;

    console.log('Login request:', { email, password, token });

    // Token-based login
    if (token) {
        const { valid, expired, verifiedToken } = await verifyJwt(token);
        
        if (!valid) {
            return next(new ErrorResponse(expired ? 'Token expired' : 'Invalid token', 401));
        }

        const user = await getUserById(verifiedToken.id);
        console.log('Token-based login user found:', user);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        
        if (!user.isVerified) {
            return next(new ErrorResponse('User is not verified. Please check your email for verification.', 403));
        }

        // Log the verified user data and token for debugging
        console.log('Token-based login user:', user); 
        console.log('Token-based login token:', token);

        return res.status(200).json({
            success: true,
            token,
            user: omit(user.toObject(), ['password']),
        });
    }

    // Validate input for traditional login
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

        // Check if user is verified
        if (!user.isVerified) { // Assuming there's an isVerified field
            return next(new ErrorResponse('User is not verified. Please check your email for verification.', 403));
        }

        // Generate JWT token
        const token = jwtSign({ id: user._id, role: user.role });

        // Send response with token and user details
        res.status(200).json({
            success: true,
            token,
            user: omit(user.toObject(), ['password']), // Exclude password
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

exports.resendVerificationEmail = asyncHandler(async (req, res, next) => {
    const { email } = req.body; // Extract email from request body

    try {
        // Check if the user exists
        const user = await RestaurateurUserModel.findOne({ email });
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Generate email verification token and URL
        const verificationToken = user.generateVerificationToken();
        const verificationUrl = `${req.protocol}://${req.get("host")}/api/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}&redirect=true`;
        
        // Log the verification URL to the console (for debugging)
        console.log('Verification URL:', verificationUrl);

        // Set up email options
        const options = {
            email: user.email,
            subject: 'Email Verification',
            message: `Please click the link below to verify your email: \n\n ${verificationUrl}`,
            html: `<p>Please click <a href="${verificationUrl}">here</a> to verify your email.</p>`
        };

        // Send verification email
        await sendEmail(options);

        // Send a response indicating the email has been sent
        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully'
        });

    } catch (error) {
        return next(new ErrorResponse('Error resending verification email', 500));
    }
});