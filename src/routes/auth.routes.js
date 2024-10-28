const express = require("express");
const {
    registerAsRestaurateur,
    registerAsProducteur,
    login,
    logout,
    resendVerificationEmail
} = require("../controllers/auth.controller");
const {
    validatePassword,
    protectWithToken,
    verifyAndGetUser,
    verifyEmail
} = require("../middlewares/auth.middleware");

const router = express.Router();

/*******************************************************************
 * @desc                Register a new Restaurateur user
 * @route               POST /api/auth/register/restaurateur
 * @access              Public
 *******************************************************************/
router.post('/auth/register/restaurateur', registerAsRestaurateur);

/*******************************************************************
 * @desc                Register a new Producteur user
 * @route               POST /api/auth/register/producteur
 * @access              Public
 *******************************************************************/
router.post('/auth/register/producteur', registerAsProducteur);

/*******************************************************************
 * @desc                Login user (both restaurateur and producteur)
 * @route               POST /api/auth/login
 * @access              Public
 *******************************************************************/
router.post('/auth/login', validatePassword, login);

/*******************************************************************
 * @desc                Logout a user
 * @route               POST /api/auth/logout
 * @access              Public
 *******************************************************************/
router.post('/auth/logout', logout);

/*******************************************************************
 * @desc                Get current logged-in user's data
 * @route               GET /api/auth/me
 * @access              Private
 *******************************************************************/
router.get('/auth/me', protectWithToken, verifyAndGetUser);

/*******************************************************************
 * @desc                Verify user email
 * @route               GET /api/auth/verify-email
 * @access              Public
 *******************************************************************/
router.get('/auth/verify-email', verifyEmail);

/*******************************************************************
 * @desc                resend user verification email
 * @route               GET /api/auth/resendVerificationEmail
 * @access              Public
 *******************************************************************/
router.post('/auth/resend-verification', resendVerificationEmail);

/*******************************************************************
 * @desc                Check if user is verified
 * @route               GET /api/auth/check-verification
 * @access              Private
 *******************************************************************/
router.get('/auth/check-verification', protectWithToken, (req, res, next) => {
    const user = req.user; // This is populated by the protectWithToken middleware

    // Send the verification status
    res.status(200).json({
        success: true,
        isVerified: user.isVerified
    });
});

/*******************************************************************
 * @desc                Check if user is verified
 * @route               GET /api/auth/check-verification
 * @access              Private
 *******************************************************************/
router.get('/verify-email/:token', verifyEmail);


module.exports = router;
