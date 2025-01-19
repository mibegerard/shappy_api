const asyncHandler = require("../helper/asyncHandler");
const ErrorResponse = require("../helper/errorResponse");
const RestaurateurUserModel = require("../models/restaurateur.model");
const ProducteurUserModel = require("../models/producteur.model");
const ProductModel = require("../models/product.model");
const { omit } = require("lodash");

// Helper function to determine the correct model based on role
const getModelByRole = (role) => {
    if (role === 'restaurateur') return RestaurateurUserModel;
    if (role === 'producteur') return ProducteurUserModel;
    throw new ErrorResponse(`Invalid role: ${role}`, 400);
};

/*******************************************************************
 * @desc                Post Profile Picture
 * @Method              POST
 * @URL                 /api/users/:id/profile-picture
 * @access              Private
 *******************************************************************/
exports.postProfilePicture = asyncHandler(async (req, res, next) => {
    console.log("Received request to update profile picture");
    console.log("Request Params (id):", req.params.id);
    console.log("Request Body (role, profilePicture):", req.body);
    console.log("Uploaded File:", req.file);

    const { id } = req.params;
    const { role } = req.body;

    // Ensure profilePicture exists in req.body
    const profilePicture = req.body.profilePicture || req.file?.path;
    if (!profilePicture) {
        console.error("Profile picture is missing in the request body");
        return next(new ErrorResponse("Profile picture is required to update", 400));
    }

    console.log("Updating Profile Picture:", { id, profilePicture, role });


    // Verify role is provided
    if (!role) {
        console.error("Role is missing in the request body");
        return next(new ErrorResponse("Role is required to process the request", 400));
    }

    // Verify profilePicture is provided
    if (!profilePicture) {
        console.error("Profile picture is missing in the request body");
        return next(new ErrorResponse("Profile picture is required to update", 400));
    }

    try {
        const UserModel = getModelByRole(role);
        console.log("Resolved UserModel based on role:", role);

        const user = await UserModel.findByIdAndUpdate(
            id,
            { profilePicture },
            { new: true, runValidators: true }
        );

        if (!user) {
            console.error("No user found with ID:", id);
            return next(new ErrorResponse(`User not found with ID ${id}`, 404));
        }

        console.log("User profile picture updated successfully:", user);

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data: omit(user.toObject(), ["password"]),
        });
    } catch (error) {
        console.error("Error updating profile picture:", error);
        return next(new ErrorResponse("Internal Server Error", 500));
    }
});


/*******************************************************************
 * @desc                Get Profile Picture
 * @Method              GET
 * @URL                 /api/users/:id/profile-picture
 * @access              Public
 *******************************************************************/
exports.getProfilePicture = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.query;

    const UserModel = getModelByRole(role);

    const user = await UserModel.findById(id, "profilePicture");

    if (!user) {
        return next(new ErrorResponse(`User not found with ID ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: user.profilePicture,
    });
});

/*******************************************************************
 * @desc                Post Description
 * @Method              POST
 * @URL                 /api/users/:id/description
 * @access              Private
 *******************************************************************/
exports.postDescription = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { role, description } = req.body;

    const UserModel = getModelByRole(role);

    const user = await UserModel.findByIdAndUpdate(id, { description }, { new: true, runValidators: true });

    if (!user) {
        return next(new ErrorResponse(`User not found with ID ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: "Description updated successfully",
        data: omit(user.toObject(), ["password"]),
    });
});

/*******************************************************************
 * @desc                Get Description
 * @Method              GET
 * @URL                 /api/users/:id/description
 * @access              Public
 *******************************************************************/
exports.getDescription = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.query;

    const UserModel = getModelByRole(role);

    const user = await UserModel.findById(id, "description");

    if (!user) {
        return next(new ErrorResponse(`User not found with ID ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: user.description,
    });
});

/*******************************************************************
 * @desc                Delete Profile Picture
 * @Method              DELETE
 * @URL                 /api/users/:id/profile-picture
 * @access              Private
 *******************************************************************/
exports.deleteProfilePicture = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;

    const UserModel = getModelByRole(role);

    const user = await UserModel.findByIdAndUpdate(id, { profilePicture: null }, { new: true, runValidators: true });

    if (!user) {
        return next(new ErrorResponse(`User not found with ID ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: "Profile picture deleted successfully",
    });
});

/*******************************************************************
 * @desc                Delete Description
 * @Method              DELETE
 * @URL                 /api/users/:id/description
 * @access              Private
 *******************************************************************/
exports.deleteDescription = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;

    const UserModel = getModelByRole(role);

    const user = await UserModel.findByIdAndUpdate(id, { description: null }, { new: true, runValidators: true });

    if (!user) {
        return next(new ErrorResponse(`User not found with ID ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: "Description deleted successfully",
    });
});

/*******************************************************************
 * @desc                Update current restaurateur by a property
 * @Method              PUT
 * @URL                 /api/restaurateurs/update
 * @access              Private
 *******************************************************************/
exports.updateRestaurateurProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user?.id;
    const { property, updateData } = req.body;

    // Log incoming data for debugging
    console.log('Incoming Request:', req.body);

    if (!userId) {
        return next(new ErrorResponse('User ID is required', 400));
    }

    if (!property || !updateData) {
        return next(new ErrorResponse('Property and update data are required', 400));
    }

    // Log the property and updateData being used for the update
    console.log(`Updating restaurateur's ${property} with data:`, updateData);

    // Construct the update query dynamically
    const updateQuery = {
        _id: userId,
    };

    // Log the update query before executing the update
    console.log('Update Query:', updateQuery);

    // Perform the update with the correct payload structure
    const restaurateur = await RestaurateurUserModel.findOneAndUpdate(updateQuery, updateData, {
        new: true,
        runValidators: true,
    });

    if (!restaurateur) {
        return next(
            new ErrorResponse(`No restaurateur found with ID = ${userId}`, 404)
        );
    }

    // Log the updated restaurateur data (excluding password)
    console.log('Updated Restaurateur:', omit(restaurateur.toObject(), ['password']));

    // Send the response with the updated data
    res.status(200).json({
        success: true,
        data: omit(restaurateur.toObject(), ['password']),
    });
});


/*******************************************************************
 * @desc                Update current producteur by a property
 * @Method              PUT
 * @URL                 /api/producteurs/update
 * @access              Private
 *******************************************************************/
exports.updateProducteurProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user?.id;
    const { property, updateData } = req.body;

    // Log incoming data for debugging
    console.log('Incoming Request:', req.body);

    if (!userId) {
        return next(new ErrorResponse('User ID is required', 400));
    }

    if (!property || !updateData) {
        return next(new ErrorResponse('Property and update data are required', 400));
    }

    // Log the property and updateData being used for the update
    console.log(`Updating producteur's ${property} with data:`, updateData);

    // Construct the update query dynamically
    const updateQuery = {
        _id: userId,
    };

    // Log the update query before executing the update
    console.log('Update Query:', updateQuery);

    // Perform the update with the correct payload structure
    const producteur = await ProducteurUserModel.findOneAndUpdate(updateQuery, updateData, {
        new: true,
        runValidators: true,
    });

    if (!producteur) {
        return next(
            new ErrorResponse(`No producteur found with ID = ${userId}`, 404)
        );
    }

    // Log the updated producteur data (excluding password)
    console.log('Updated Producteur:', omit(producteur.toObject(), ['password']));

    // Send the response with the updated data
    res.status(200).json({
        success: true,
        data: omit(producteur.toObject(), ['password']),
    });
});

/*******************************************************************
 * @desc    Get all products by user ID
 * @route   GET /products/user/:userId
 * @access  Public
 *******************************************************************/
exports.getProductsByUserId = asyncHandler(async (req, res, next) => {
    const { userId } = req.params; // Extract user ID from the route parameter
    const { page = 1, limit = 10 } = req.query; // Extract pagination parameters

    // Validate userId
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required",
        });
    }

    // Find products created by the specific user
    const query = { producteur: userId };

    const products = await ProductModel.find(query)
        .populate('producteur', 'firstName lastName commune postalCode telephone')
        .sort({ createdAt: -1 }) // Default sorting by creation date in descending order
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const totalCount = await ProductModel.countDocuments(query);

    res.status(200).json({
        success: true,
        count: products.length,
        total: totalCount,
        page: Number(page),
        totalPages: Math.ceil(totalCount / limit),
        data: products,
    });
});
