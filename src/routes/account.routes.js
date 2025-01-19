const express = require("express");
const {
    postProfilePicture,
    getProfilePicture,
    postDescription,
    getDescription,
    deleteProfilePicture,
    deleteDescription,
    updateProducteurProfile,
    updateRestaurateurProfile,
    getProductsByUserId
} = require("../controllers/account.controller");

const { protectWithToken } = require("../middlewares/auth.middleware");
const uploadImageMiddleware = require('../middlewares/uploadImage.middleware');

const router = express.Router();

/*******************************************************************
 * @desc                Post Profile Picture
 * @route               POST /api/users/:id/profile-picture
 * @access              Private
 *******************************************************************/
router.route('/:id/profile-picture').post(protectWithToken, uploadImageMiddleware("profilePicture"),  postProfilePicture);

/*******************************************************************
 * @desc                Get Profile Picture
 * @route               GET /api/users/:id/profile-picture
 * @access              Public
 *******************************************************************/
router.route('/:id/profile-picture').get(getProfilePicture);

/*******************************************************************
 * @desc                Post Description
 * @route               POST /api/users/:id/description
 * @access              Private
 *******************************************************************/
router.route('/:id/description').post(protectWithToken, postDescription);

/*******************************************************************
 * @desc                Get Description
 * @route               GET /api/users/:id/description
 * @access              Public
 *******************************************************************/
router.route('/:id/description').get(getDescription);

/*******************************************************************
 * @desc                Delete Profile Picture
 * @route               DELETE /api/users/:id/profile-picture
 * @access              Private
 *******************************************************************/
router.route('/:id/profile-picture').delete(protectWithToken, deleteProfilePicture);

/*******************************************************************
 * @desc                Delete Description
 * @route               DELETE /api/users/:id/description
 * @access              Private
 *******************************************************************/
router.route('/:id/description').delete(protectWithToken, deleteDescription);

/*******************************************************************
 * @desc                Update current restaurateur profile by a property
 * @route               PUT /api/restaurateur/update
 * @access              Private
 *******************************************************************/
router.route('/restaurateur/update').put(protectWithToken, updateRestaurateurProfile);

/*******************************************************************
 * @desc                Update current producteur profile by a property
 * @route               PUT /api/producteurs/update
 * @access              Private
 *******************************************************************/
router.route('/producteur/update').put(protectWithToken, updateProducteurProfile);

/*******************************************************************
 * @desc    Get all products by user ID
 * @route   GET /products/user/:userId
 * @access  Public
 *******************************************************************/
router.route('/products/user/:userId').get(protectWithToken, getProductsByUserId);

module.exports = router;
